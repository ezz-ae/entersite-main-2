import { NextRequest, NextResponse } from 'next/server';
import { mainSystemPrompt } from '@/config/prompts';
import { ENTRESTATE_INVENTORY } from '@/data/entrestate-inventory';

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Missing message' }, { status: 400 });
        }

        // Simulate AI response
        const inventoryString = JSON.stringify(ENTRESTATE_INVENTORY, null, 2);
        const prompt = `${mainSystemPrompt}\n\nHere is the current property inventory:\n${inventoryString}\n\nUser message: ${message}`;

        // In a real application, you would send this prompt to a large language model.
        // For now, we'll return a hardcoded response based on the user's message.

        let aiResponse = "I'm sorry, I don't have information about that. I can help you with properties like Marina Horizon or Terrace Gardens.";

        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('marina horizon')) {
            aiResponse = `Marina Horizon is a stunning waterfront development in Dubai Marina with residences starting from AED 2.75M. It offers amazing skyline views and hotel-grade amenities. Would you like to know more about the available units or its 8.2% projected ROI?`;
        } else if (lowerCaseMessage.includes('terrace gardens')) {
            aiResponse = `Terrace Gardens offers beautiful duplex garden homes in a community-focused environment, with prices starting at AED 1.4M. It features unique amenities like a maker studio and community farming plots. Are you interested in the 2-4 bedroom options?`;
        } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            aiResponse = "Hello! I'm your AI real estate assistant. How can I help you find your dream property today? I have information on exclusive projects like Marina Horizon and Terrace Gardens.";
        }

        return NextResponse.json({ 
            reply: aiResponse,
            prompt: prompt // For debugging/demonstration
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
    }
}
