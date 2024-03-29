import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Events webhook response", body);

    return NextResponse.json({
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      status: 500
    });
  }
}
