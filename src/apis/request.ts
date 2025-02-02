interface FetchOption {
  method: "GET" | "POST";
  timeout: number;
  errMsg: string;
}

// 结合 AbortController 实现超时
export default async function request<Req, Res>(
  url: string,
  data: Req | null = null,
  option?: FetchOption
): Promise<Res> {
  const timeout = option?.timeout || 8000;
  const method = option?.method || "GET";
  const errMsg = option?.errMsg;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const options = {
    method,
    data,
    signal: controller.signal, // 绑定中止信号
  };

  try {
    const response = await fetch(`/api${url}`, options);
    clearTimeout(timeoutId);
    const { success, data } = await response.json();
    if (!success) {
      throw new Error(errMsg)
    }
    return data
  } catch (e: any) {
    if (errMsg) {
      window.$message.error(errMsg);
    }
    if (e.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw e;
  }
}
