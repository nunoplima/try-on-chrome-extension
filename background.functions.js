import { GoogleGenerativeAI } from '@google/generative-ai'

export const trimHtmlContent = (
  htmlContent,
  tagsToRemove = ['nav', 'footer', 'link', 'script', 'iframe'],
) => {
  const bodyContentMatch = htmlContent.match(
    /<body[^>]*>((.|[\n\r])*)<\/body>/im,
  )
  let bodyContent = bodyContentMatch ? bodyContentMatch[1] : ''

  tagsToRemove.forEach((tag) => {
    const tagRegex = new RegExp(`<${tag}[^>]*>(.|[\n\r])*?</${tag}>`, 'gi')
    bodyContent = bodyContent.replace(tagRegex, '')
  })

  return bodyContent
}

export const findProductPhotoUrl = async (htmlContent) => {
  try {
    const googleGeminiApiKey = import.meta.env.VITE_GEMINI_AI_KEY
    if (!googleGeminiApiKey) {
      throw new Error('Google Gemini API key not provided')
    }

    const prompt = `
      Analyze the following HTML content and extract the URL of the main product image.
      Look for both <img> tags and CSS background-image properties.
      Consider elements and children with class names or IDs containing words like 'product-image' 'product', 'main', 'featured' etc.
      Return only the full URL with commonly used image extensions (jpg, jpeg, png, webp) of the main product image in JSON format, with the key "data".
      If you can't find a product image, return {"data": null}.

      HTML content:
      ${htmlContent}
    `

    const genAI = new GoogleGenerativeAI(googleGeminiApiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const result = await model.generateContent(prompt)
    return JSON.parse(result.response.text())
  } catch (error) {
    return { error: 'Error fetching product image from Gemini AI.' }
  }
}

// export const findProductPhotoUrlFromOpenAi = async (htmlContent) => {
//   const openAIApiKey = import.meta.env.VITE_OPEN_AI_KEY
//   if (!openAIApiKey) {
//     throw new Error('OpenAI API key not provided')
//   }

//   const prompt = `
//     Analyze the following HTML content and extract the URL of the main product image.
//     Look for both <img> tags and CSS background-image properties.
//     Consider elements and children with class names or IDs containing words like 'product-image' 'product', 'main', 'featured' etc.
//     Return only the full URL with commonly used image extensions (jpg, jpeg, png, webp) of the main product image in JSON format, with the key "productImageUrl".
//     If you can't find a product image, return {"productImageUrl": null}.

//     HTML content:
//     ${htmlContent.substring(0, 50000)}
//   `

//   try {
//     const response = await ky
//       .post('https://api.openai.com/v1/chat/completions', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${openAIApiKey}`,
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o-mini',
//           messages: [{ role: 'user', content: prompt }],
//           response_format: {
//             type: 'json_object',
//           },
//         }),
//       })
//       .json()

//     const { productImageUrl } = JSON.parse(
//       response.choices[0].message.content.trim(),
//     )

//     return { data: productImageUrl }
//   } catch (error) {
//     return { error: `Error fetching product image from GPT-4o:', ${error}` }
//   }
// }
