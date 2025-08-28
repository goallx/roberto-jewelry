import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import CustomiseModel from "@/models/customise";

export async function GET(req: Request) {
    try {
        const role = req.headers.get('x-user-role')

        if (role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        let query = {};
        if (id) {
            query = { _id: id };
        }

        let customise;
        if (id) {
            customise = await CustomiseModel.findOne(query)
        } else {
            customise = await CustomiseModel.find();
        }

        return NextResponse.json({ data: customise }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookies = req.headers.get("cookie");
        if (!cookies) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const token = cookies
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const { id: userId, email, firstName, lastName } = decoded as { id: string, email: string, firstName: string, lastName: string };
        const body = await req.json()
        await dbConnect();
        const fullName = `${firstName ?? ""} ${lastName ?? ""}`

        const newCustomiseRequest = new CustomiseModel({
            fullName,
            email,
            customerId: userId,
            category: body.category,
            material: body.materials,
            images: body.images,
            additional: body.additional,
            priceRange: body.priceRange
        })

        await newCustomiseRequest.save()

        return NextResponse.json({ message: 'Customise order has been submitted!' }, { status: 200 });
    } catch (err: any) {
        console.error(err.message || err);
        return NextResponse.json(
            {
                message: err.message || err,
            },
            { status: 500 }
        );
    }
}


export async function PUT(req: Request) {
    try {
        const cookies = req.headers.get("cookie");

        if (!cookies) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const token = cookies
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const { role } = decoded as { role: string };
        if (role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        const updatedOrder = await CustomiseModel.findOneAndUpdate(
            { _id: id },
            {
                opened: true
            },
            { new: true }
        )

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedOrder }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
}
