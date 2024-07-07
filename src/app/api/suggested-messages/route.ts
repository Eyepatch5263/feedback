import { GoogleGenerativeAI } from '@google/generative-ai'


const apiKey = process.env.API_KEY
let genAI: any
if (typeof apiKey === 'string') {
    genAI = new GoogleGenerativeAI(apiKey);
    // Use genAI here
} else {
    console.error('API_KEY environment variable is not set or not a string.');
    // Handle the error case (throw error, use default value, etc.)
}


const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" })
export async function POST(request: Request) {
    try {
        const prompt="create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for anonymous social messaging platform, like Qooh.me and should be suitable for diverse audience. Avoid personal and sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: What's a hobby you recently started?||If you could have a dinner with any historical figure, who would it be?||What's simple thing that makes you happy?, Ensure each question is intriguing, foster curiosity and contribute to a positive and welcoming conversational environment"
        if(!genAI){
            return  Response.json({success:false,message:'Unauthorized access'}, { status: 403 })
        }
        const result = await model.generateContent(prompt);
        
        const Message=result.response.candidates[0].content.parts[0].text
        console.log(Message)
        return Response.json({
            success:true,
            message:Message
        },{status:200})
    } catch (error) {
        console.log('[CONVERSATION_ERROR', error)
        return Response.json({
            success:false,
            message:error
        },{status:500})
    }
}