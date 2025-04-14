export class GhibliClient {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(baseUrl: string = 'https://www.gpt4oimg.com', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(apiKey: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  async textToImage(prompt: string, aspectRatio: string = "1:1", style: string = "anime", apiKey: string): Promise<string> {
    const fullPrompt = `${prompt}. aspect_ratio is ${aspectRatio}. style: ${style}`;
    
    const payload = {
      prompt: fullPrompt,
      image: ""
    };

    // 打印请求信息
    process.stderr.write(`\n[Request] POST ${this.baseUrl}/api/image\n`);
    process.stderr.write(`[Headers] ${JSON.stringify(this.getHeaders(apiKey), null, 2)}\n`);
    process.stderr.write(`[Payload] ${JSON.stringify(payload, null, 2)}\n`);

    const response = await fetch(`${this.baseUrl}/api/image`, {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body: JSON.stringify(payload)
    });

    // 打印响应状态
    process.stderr.write(`[Response] Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const error = `API request failed: ${response.statusText}`;
      process.stderr.write(`[Error] ${error}\n`);
      throw new Error(error);
    }

    const result = await response.json();
    process.stderr.write(`[Response Data] ${JSON.stringify(result, null, 2)}\n`);
    return result.data;
  }

  async imageToImage(sourceImage: string, prompt: string = "", aspectRatio: string = "1:1", style: string = "anime", apiKey: string): Promise<string> {
    const fullPrompt = `${prompt}. aspect_ratio is ${aspectRatio}. style: ${style}`;
    
    const payload = {
      prompt: fullPrompt,
      image: sourceImage
    };

    // 打印请求信息
    process.stderr.write(`\n[Request] POST ${this.baseUrl}/api/image\n`);
    process.stderr.write(`[Headers] ${JSON.stringify(this.getHeaders(apiKey), null, 2)}\n`);
    process.stderr.write(`[Payload] Image length: ${sourceImage.length}, Prompt: ${fullPrompt}\n`);

    const response = await fetch(`${this.baseUrl}/api/image`, {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body: JSON.stringify(payload)
    });

    // 打印响应状态
    process.stderr.write(`[Response] Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const error = `API request failed: ${response.statusText}`;
      process.stderr.write(`[Error] ${error}\n`);
      throw new Error(error);
    }

    const result = await response.json();
    process.stderr.write(`[Response Data] ${JSON.stringify(result, null, 2)}\n`);
    return result.data;
  }

  async imageToVideo(
      sourceImage: string, 
      prompt: string = "in the style of ghibli", 
      aspectRatio: string = "9:16",
      negativePrompt: string = "bad prompt",
      apiKey: string
    ): Promise<string> {
      const payload = {
        prompt,
        task_type: "img2video-14b",
        negative_prompt: negativePrompt,
        aspect_ratio: aspectRatio,
        image: sourceImage
      };
  
      // 打印请求信息
      process.stderr.write(`\n[Request] POST ${this.baseUrl}/api/video\n`);
      process.stderr.write(`[Headers] ${JSON.stringify(this.getHeaders(apiKey), null, 2)}\n`);
      process.stderr.write(`[Payload] Image length: ${sourceImage.length}, Prompt: ${prompt}\n`);
  
      const response = await fetch(`${this.baseUrl}/api/video`, {
        method: 'POST',
        headers: this.getHeaders(apiKey),
        body: JSON.stringify(payload)
      });
  
      // 打印响应状态
      process.stderr.write(`[Response] Status: ${response.status} ${response.statusText}\n`);
  
      if (!response.ok) {
        const error = `API request failed: ${response.statusText}`;
        process.stderr.write(`[Error] ${error}\n`);
        throw new Error(error);
      }
  
      const result = await response.json();
      process.stderr.write(`[Response Data] ${JSON.stringify(result, null, 2)}\n`);
      return result.data?.task_id;
    }

  async getPoints(apiKey: string): Promise<number> {
    // 打印请求信息
    process.stderr.write(`\n[Request] GET ${this.baseUrl}/api/user/credits\n`);
    process.stderr.write(`[Headers] ${JSON.stringify(this.getHeaders(apiKey), null, 2)}\n`);

    const response = await fetch(`${this.baseUrl}/api/user/credits`, {
      method: 'GET',
      headers: this.getHeaders(apiKey)
    });

    // 打印响应状态
    process.stderr.write(`[Response] Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const error = `API request failed: ${response.statusText}`;
      process.stderr.write(`[Error] ${error}\n`);
      throw new Error(error);
    }

    const result = await response.json();
    // 打印响应数据
    process.stderr.write(`[Response Data] ${JSON.stringify(result, null, 2)}\n`);

    return result.data?.left_credits || 0;
  }

  async getTaskResult(taskId: string, apiKey: string): Promise<TaskResult> {
      // 打印请求信息
      const url = `${this.baseUrl}/api/video/result?task_id=${taskId}`;
      process.stderr.write(`\n[Request] GET ${url}\n`);
      process.stderr.write(`[Headers] ${JSON.stringify(this.getHeaders(apiKey), null, 2)}\n`);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(apiKey)
      });
  
      // 打印响应状态
      process.stderr.write(`[Response] Status: ${response.status} ${response.statusText}\n`);
  
      if (!response.ok) {
        const error = `API request failed: ${response.statusText}`;
        process.stderr.write(`[Error] ${error}\n`);
        throw new Error(error);
      }
  
      const result = await response.json();
      process.stderr.write(`[Response Data] ${JSON.stringify(result, null, 2)}\n`);
      return result.data;
    }
}

export type TaskResult = {
  status: 'pending' | 'completed' | 'failed';
  result?: string;
  error?: string;
};

export type PointsResponse = {
  points: number;
  lastUpdate: string;
};
