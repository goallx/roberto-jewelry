import axios, { AxiosRequestConfig } from "axios";

export interface ITransactionBody {
  orderId: string;
  amount: number;
  creditName: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  creditNumber: string;
  creditMonth: string;
  creditYear: string;
  creditCvv: string;
}

class PayPlusService {
  private static instance: PayPlusService;

  private constructor() {}

  public static getInstance(): PayPlusService {
    if (!PayPlusService.instance) {
      PayPlusService.instance = new PayPlusService();
    }
    return PayPlusService.instance;
  }

  public async chargeTransactionJ4(body: ITransactionBody): Promise<any> {
    const endpoint = "Transactions/Charge";
    const data = {
      terminal_uid:
        process.env.PAY_PLUS_TERMINAL_UID ||
        "e1396310-e3f8-461f-b80a-55b199211359",
      cashier_uid:
        process.env.PAY_PLUS_CASHIER_UID ||
        "e1396310-e3f8-461f-b80a-55b199211359",
      amount: body.amount,
      currency_code: "USD",
      credit_terms: "1",
      charge_method: "1",
      use_token: false,
      customer_name_invoice: body.creditName,
      initial_invoice: false,
      create_token: false,
      customer: {
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
      },
      credit_card: {
        number: body.creditNumber,
        exp_mm: body.creditMonth,
        exp_yy: body.creditYear,
        cvv: body.creditCvv,
      },
    };

    return this.makeApiRequest(endpoint, data);
  }

  public async getErrorCodes(): Promise<any> {
    const endpoint = "ErrorCodes/";
    const params = {
      terminal_uid: process.env.PAY_PLUS_TERMINAL_UID,
    };
    return this.makeApiRequest(endpoint, params, "GET");
  }

  private async makeApiRequest(
    endpoint: string,
    params: any = {},
    method: string = "POST"
  ): Promise<any> {
    const url = `${process.env.PAY_PLUS_API_URL}${endpoint}`;
    const headers = this.getHeaders();

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data: method === "GET" ? undefined : params,
      params: method === "GET" ? params : undefined,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  private getHeaders(): any {
    return {
      "Content-Type": "application/json",
      api_key: process.env.PAY_PLUS_API_KEY,
      secret_key: process.env.PAY_PLUS_API_SECRET,
      hash: "yb4ViUaVO6OFdF9iyISKtCi+cXTvWm0+3e/sQkPsNS0=",
      "user-agent": "PayPlus",
      Authorization: JSON.stringify({
        api_key: process.env.PAY_PLUS_API_KEY,
        secret_key: process.env.PAY_PLUS_API_SECRET,
      }),
    };
  }
}

export default PayPlusService.getInstance();
