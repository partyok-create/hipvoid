import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { SolapiMessageService } from 'solapi';
import nodemailer from 'nodemailer';

// Firestore 트랜잭션으로 창조자 번호 순번 부여
async function assignCreatorNumber(): Promise<string> {
  const counterRef = adminDb.collection('_meta').doc('creatorCounter');

  const newCount = await adminDb.runTransaction(async (t) => {
    const snap = await t.get(counterRef);
    const count = (snap.data()?.count ?? 0) + 1;
    t.set(counterRef, { count }, { merge: true });
    return count;
  });

  return String(newCount).padStart(4, '0');
}

// Solapi SMS 발송
async function sendSMS(phone: string, creatorNumber: string): Promise<void> {
  const messageService = new SolapiMessageService(
    process.env.SOLAPI_API_KEY!,
    process.env.SOLAPI_API_SECRET!
  );

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  await messageService.sendOne({
    message: {
      to: cleanPhone,
      from: process.env.SOLAPI_SENDER!,
      text: `[힙보이드] 창조자 번호: ${creatorNumber}\nhipvoid.vercel.app/enter 에서 위 번호로 입장하세요.`,
    },
  });
}

// Gmail 이메일 발송
async function sendEmail(email: string, creatorNumber: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_APP_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: `힙보이드 <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `[힙보이드] 창조자 번호 ${creatorNumber} — 입장 안내`,
    html: `
      <div style="background:#000000;color:#F5F5F7;font-family:sans-serif;padding:40px 32px;max-width:480px;margin:0 auto;">
        <p style="font-size:11px;letter-spacing:0.4em;color:#2DE1FF;margin:0 0 24px;">HIPVOID</p>
        <h2 style="font-size:24px;font-weight:300;line-height:1.5;margin:0 0 8px;">
          창조자 번호가<br>도착했습니다
        </h2>
        <p style="font-size:13px;color:#9AA0B2;margin:0 0 32px;">아래 번호로 힙보이드에 입장하세요.</p>
        <div style="border:1px solid rgba(45,225,255,0.4);padding:28px;text-align:center;margin-bottom:32px;">
          <p style="font-size:11px;letter-spacing:0.3em;color:#9AA0B2;margin:0 0 10px;">CREATOR No.</p>
          <p style="font-size:52px;letter-spacing:0.5em;font-family:Georgia,serif;color:#F8E71C;margin:0;">${creatorNumber}</p>
        </div>
        <a href="https://hipvoid.vercel.app/enter"
           style="display:block;background:#2DE1FF;color:#000000;text-align:center;padding:16px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.05em;">
          입장하기 →
        </a>
        <p style="font-size:11px;color:#9AA0B2;margin:24px 0 0;text-align:center;">
          김영한 著 ·『힙 — 허무는 창조다』
        </p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // FORM_RESPONSE 이벤트만 처리
    if (body.eventType !== 'FORM_RESPONSE') {
      return NextResponse.json({ ok: true });
    }

    const fields: Array<{ key: string; label: string; type: string; value: unknown }> =
      body.data?.fields ?? [];

    let email = '';
    let phone = '';
    let name = '';

    for (const field of fields) {
      const type = (field.type ?? '').toUpperCase();
      const label = (field.label ?? '').toLowerCase();
      const value = String(field.value ?? '').trim();
      if (!value) continue;

      if (type === 'INPUT_EMAIL' || label.includes('이메일') || label.includes('email')) {
        email = value;
      } else if (
        type === 'INPUT_PHONE_NUMBER' ||
        label.includes('휴대폰') ||
        label.includes('전화') ||
        label.includes('phone')
      ) {
        phone = value;
      } else if (type === 'INPUT_TEXT' && (label.includes('이름') || label.includes('name'))) {
        name = value;
      }
    }

    if (!email && !phone) {
      console.error('연락처 없음:', JSON.stringify(body));
      return NextResponse.json({ error: 'no contact info' }, { status: 400 });
    }

    // 창조자 번호 부여
    const creatorNumber = await assignCreatorNumber();

    // Firestore에 저장
    await adminDb.collection('creators').add({
      name,
      email,
      phone,
      creatorNumber,
      createdAt: new Date().toISOString(),
      tallySubmissionId: body.data?.submissionId ?? '',
    });

    // SMS + 이메일 동시 발송
    const tasks: Promise<void>[] = [];
    if (phone) tasks.push(sendSMS(phone, creatorNumber));
    if (email) tasks.push(sendEmail(email, creatorNumber));
    await Promise.all(tasks);

    console.log(`창조자 ${creatorNumber} 등록 완료 — ${email || phone}`);
    return NextResponse.json({ ok: true, creatorNumber });
  } catch (err) {
    console.error('Tally 웹훅 오류:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
