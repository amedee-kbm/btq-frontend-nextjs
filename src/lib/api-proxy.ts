import { getToken } from "@/lib/auth";

type RequestHeaders = Record<string, string>;

export default class ApiProxy {
  static async getHeaders(requireAuth: boolean): Promise<RequestHeaders> {
    const headers: RequestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const authToken = await getToken();
    if (authToken && requireAuth === true) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  static async handleFetch(
    endpoint: string,
    requestOptions: RequestInit,
  ): Promise<{ data: unknown; status: number }> {
    let data: unknown = {};
    let status = 500;

    try {
      const response = await fetch(endpoint, requestOptions);
      data = await response.json();
      status = response.status;
    } catch (error) {
      data = { message: "Cannot reach API server", error };
      status = 500;
    }

    return { data, status };
  }

  static async put(
    endpoint: string,
    object: unknown,
    requireAuth: boolean,
  ): Promise<{ data: unknown; status: number }> {
    const jsonData = JSON.stringify(object);
    const headers = await ApiProxy.getHeaders(requireAuth);
    const requestOptions: RequestInit = {
      method: "PUT",
      headers,
      body: jsonData,
    };

    return await ApiProxy.handleFetch(endpoint, requestOptions);
  }

  static async delete(
    endpoint: string,
    requireAuth: boolean,
  ): Promise<{ data: unknown; status: number }> {
    const headers = await ApiProxy.getHeaders(requireAuth);
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers,
    };

    return await ApiProxy.handleFetch(endpoint, requestOptions);
  }

  static async post(
    endpoint: string,
    object: unknown,
    requireAuth: boolean,
  ): Promise<{ data: unknown; status: number }> {
    const jsonData = JSON.stringify(object);
    const headers = await ApiProxy.getHeaders(requireAuth);
    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body: jsonData,
    };

    return await ApiProxy.handleFetch(endpoint, requestOptions);
  }

  static async get(
    endpoint: string,
    requireAuth: boolean,
  ): Promise<{ data: unknown; status: number }> {
    const headers = await ApiProxy.getHeaders(requireAuth);
    const requestOptions: RequestInit = {
      method: "GET",
      headers,
    };

    return await ApiProxy.handleFetch(endpoint, requestOptions);
  }
}
