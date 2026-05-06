import axios from "axios";
import { NextResponse } from "next/server";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXl2ZWx1Z2F0aUBnbWFpbC5jb20iLCJleHAiOjE3NzgwNTc1ODgsImlhdCI6MTc3ODA1NjY4OCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImJkNDg1Zjc0LTYwMTQtNDlkNS1hZjJhLWE5NTY3YmZjYTA3MCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFrc2hheSByZWRkeSIsInN1YiI6IjNmYTM0YTA0LTcyOTItNGM4NC1iZTkzLTY4NDNmODYyZGJiNyJ9LCJlbWFpbCI6ImFrc2hheXZlbHVnYXRpQGdtYWlsLmNvbSIsIm5hbWUiOiJha3NoYXkgcmVkZHkiLCJyb2xsTm8iOiJhbS5haS51NGFpZDIzMDYyIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiM2ZhMzRhMDQtNzI5Mi00Yzg0LWJlOTMtNjg0M2Y4NjJkYmI3IiwiY2xpZW50U2VjcmV0IjoiYVllYXFtZk1TRkZqalpkWSJ9.utek-59xsU81a0sgb2kRqbXFZwClo8cyhirHHLvBbgM";

export async function GET() {
  try {
    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error.response?.data);
    console.log(error.response?.status);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
      },
      {
        status: 500,
      }
    );
  }
}