import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const {to, body} = await req.json();

    console.log(`Sending SMS to ${to} with body: ${body}`);

    return NextResponse.json({status: 'ok'});
}
