import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import UserModel from "@/models/User";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { IMember } from "@/components/table/MembersTable";
import MembershipModel, { MembershipTypes } from "@/models/Membership";
import payPlus, { ITransactionBody } from '../transaction/transaction2.service'

export async function GET(req: Request) {
    const role = req.headers.get('x-user-role')
    if (role !== "admin") {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const membersWithTotalSpent: IMember[] = []
    try {
        const users = await UserModel.find({})
        for (const user of users) {
            const userTotals = await Order.aggregate([
                {
                    $match: { customerId: new mongoose.Types.ObjectId(user._id) },
                },
                {
                    $group: {
                        _id: "$customerId",
                        totalSpent: { $sum: "$total" },
                    },
                },
            ]);
            user['password'] = undefined
            membersWithTotalSpent.push({ ...user.toObject(), totalSpent: userTotals[0]?.totalSpent ?? 0 })
        }
        return NextResponse.json({ data: membersWithTotalSpent }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
}


export async function POST(req: Request) {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const {
            city,
            street,
            cvv,
            expYear,
            expMonth,
            cardNumber,
            firstName,
            lastName,
        } = await req.json();
        const membershipPackage = await MembershipModel.findOne({})

        if (!membershipPackage._id.toString()) {
            return NextResponse.json({ message: "Membership Package not found!" }, { status: 404 });
        }
        const user = await UserModel.findOne({ _id: userId })
        if (user.membership) {
            return NextResponse.json({ message: "Already subscribed to membership" }, { status: 409 })
        }
        const paymentBody: ITransactionBody = {
            orderId: user._id,
            amount: membershipPackage.packagePrice,
            customerName: `${firstName ?? ""} ${lastName ?? ""}`,
            email: user.email,
            phone: user.phoneNumber ?? "",
            address: street,
            creditName: "Visa",
            city,
            creditNumber: cardNumber,
            creditMonth: expMonth,
            creditYear: expYear,
            creditCvv: cvv,
        }
        let transactionId = "";

        try {
            const res = await payPlus.chargeTransactionJ4(paymentBody);

            if (res.results.status === "success") {
                transactionId = res.data.transaction.uid;
                const membershipData = {
                    joinDate: new Date().toISOString(),
                    membershipId: membershipPackage._id,
                    memberKind: MembershipTypes.PAID,
                };
                user["membership"] = membershipData;
                await user.save();
            } else {
                return NextResponse.json(
                    { message: res.results.description },
                    { status: 400 }
                );
            }
        } catch (err: any) {
            return NextResponse.json(
                {
                    errors: [
                        "Unable to generate the payment page, please try again later!",
                    ],
                    err: err.message || err,
                },
                { status: 400 }
            );
        }
        return NextResponse.json({ transactionId, membership: user.membership ?? null }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
}