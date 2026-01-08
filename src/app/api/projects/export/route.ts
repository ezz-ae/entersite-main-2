import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const {project} = await req.json();

    // just return the project for now
    return NextResponse.json(project);

}
