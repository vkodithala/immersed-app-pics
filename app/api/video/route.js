import { NextRequest, NextResponse } from "next/server";

// headers of any req
const bearer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTg2NDc2NSwiZW1haWwiOiJ2YXJ1bnNldHRsZUBnbWFpbC5jb20iLCJleHAiOjE3MDI5ODA3NDYuOTgxLCJpYXQiOjE3MDAzODg3NDYuOTgxfQ.mL6xibZRikMmt4NjEZjSkKyWtup1yPo5I_mWfcKv_Pc"
// dataset -> 2 -> bearer
const teamId = "9864765"
// uploads -> etag
const etag = "a0f7fe48e6320d095d6d7c7da93bc626"


function number1(filename, target) {
    const options = {
        method: 'POST',
        headers: {
          authority: 'api.runwayml.com',
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9,te;q=0.8',
          authorization: 'Bearer ' + bearer,
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          dnt: '1',
          origin: 'https://app.runwayml.com',
          pragma: 'no-cache',
          referer: 'https://app.runwayml.com/',
          'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'sentry-trace': '3b0d857855414aae9a2bf72c9f53b499-96beaca44cf3d35c-0',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        },
        body: `{"filename":"${filename}","numberOfParts":1,"type":"${target}"}`
      };
      
      return fetch('https://api.runwayml.com/v1/uploads', options)
        .then(response => response.json())
        .then(response => {
            // console.log(response)
            return response
        })
        .catch(err => console.error(err));
}

function putObjectToPresigned(url, filecontent) {
  const options = {
    method: 'PUT',
    headers: {'Content-Type': 'image/png', 'User-Agent': 'insomnia/2023.5.8'},
    body: filecontent
  };
  
  return fetch(url, options)
    .then(response => response.text())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

function getCloudfrontUrl(uploadId) {
    const uploadUrl = `https://api.runwayml.com/v1/uploads/${uploadId}/complete`
    const options = {
      method: 'POST',
      headers: {
        authority: 'api.runwayml.com',
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,te;q=0.8',
        authorization: `Bearer ${bearer}`,
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        dnt: '1',
        origin: 'https://app.runwayml.com',
        pragma: 'no-cache',
        referer: 'https://app.runwayml.com/',
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sentry-trace': 'e7526bf1bb3d46398f7bc03b84a5e5b3-9aba2f8096f78a3d-0',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      },
      body: `{"parts":[{"PartNumber":1,"ETag":"${etag}"}]}`
    };
    
    return fetch(uploadUrl, options)
      .then(response => response.json())
      .then(response => {
        return response.url
      })
      .catch(err => console.error(err));
}

function addToDataset(name, datasetUploadId, previewUploadId) {
  
  const options = {
    method: 'POST',
    headers: {
      authority: 'api.runwayml.com',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,te;q=0.8',
      authorization: 'Bearer ' + bearer,
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      dnt: '1',
      origin: 'https://app.runwayml.com',
      pragma: 'no-cache',
      referer: 'https://app.runwayml.com/',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sentry-trace': '757a88a07b5d4df3be3a8b5465606ade-abcfceb340e6949d-0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    },
    body: `{"fileCount":1,"name":"${name}","uploadId":"${datasetUploadId}","previewUploadIds":["${previewUploadId}"],"type":{"name":"image","type":"image","isDirectory":false},"asTeamId":${teamId}}`
  };
  
  return fetch('https://api.runwayml.com/v1/datasets', options)
    .then(response => response.json())
    // .then(response => console.log(response))
    .catch(err => console.error(err));
}


async function createTask(name, image_url) {
  const basename = name.split(".").at(0)
  const options = {
    method: 'POST',
    headers: {
      authority: 'api.runwayml.com',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9,te;q=0.8',
      authorization: 'Bearer ' + bearer,
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      dnt: '1',
      origin: 'https://app.runwayml.com',
      pragma: 'no-cache',
      referer: 'https://app.runwayml.com/',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sentry-trace': '174bb1a98efa4d689965f4a4a78acbce-80063a357d033ade-0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    },
    body: `{"taskType":"gen2","internal":false,"options":{"name":"Gen-2 3209764812, ${basename}, M 5","seconds":4,"gen2Options":{"mode":"gen2","seed":3209764812,"interpolate":true,"upscale":false,"watermark":true,"motion_score":22,"use_motion_score":true,"use_motion_vectors":false,"image_prompt":"${image_url}","init_image":"${image_url}"},"assetGroupName":"Gen-2","exploreMode":false},"asTeamId":${teamId}}`
  };
  
  return fetch('https://api.runwayml.com/v1/tasks', options)
    .then(response => response.json())
    .then(response => {
      return response.task.id
    })
    .catch(err => console.error(err));
}

async function checkTask(taskId) {
  const options = {
    method: 'GET',
    headers: {
      authority: 'api.runwayml.com',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9,te;q=0.8',
      authorization: `Bearer ${bearer}`,
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      dnt: '1',
      origin: 'https://app.runwayml.com',
      pragma: 'no-cache',
      referer: 'https://app.runwayml.com/',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sentry-trace': '174bb1a98efa4d689965f4a4a78acbce-a9313c98b0cd7db5-0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  };
  
  return fetch(`https://api.runwayml.com/v1/tasks/${taskId}?asTeamId=${teamId}`, options)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      return response
    })
    .catch(err => console.error(err));
}

export async function POST(req) {
    const { url } = await req.json()
    // given the url, fetch the image into a base64 string
    const filecontent = await (fetch(url)).then(response => response.blob())
    // const buffer = await response.arrayBuffer();
    // const filecontent = Buffer.from(buffer).toString('base64');
    // console.log(filecontent)
    const fileName = "harrypotter" + Math.random().toString(36).substring(7) + ".png"
    console.log(fileName)
    
    let number1Response = await number1(fileName, "DATASET" );
    let number2Response = await number1(fileName, "DATASET_PREVIEW" );
    const number1uploadId = number1Response.id
    const number1url = number1Response.uploadUrls[0]
    const number2uploadId = number2Response.id
    const number2url = number2Response.uploadUrls[0]


    await putObjectToPresigned(number1url, filecontent);
    await putObjectToPresigned(number2url, filecontent);

    const number1cfurl = await getCloudfrontUrl(number1uploadId)
    const number2cfurl = await getCloudfrontUrl(number2uploadId)

    await addToDataset(fileName, number1uploadId, number2uploadId)
    

    const taskId = await createTask(fileName, number1cfurl);
    console.log(taskId)

    let taskRunning = await checkTask(taskId)
    console.log(taskRunning)
    while (taskRunning.task.status == "PENDING" || taskRunning.task.status == "RUNNING") {
        taskRunning = await checkTask(taskId)
        setTimeout(() => {}, 1000)
    }
    // console.log(taskRunning.task.status)
    console.log(taskRunning)
    console.log(taskRunning.task.artifacts)
    console.log(taskRunning.task.artifacts[0])
    console.log(taskRunning.task.artifacts[0].url)
    return new NextResponse(taskRunning.task.artifacts[0].url)
}