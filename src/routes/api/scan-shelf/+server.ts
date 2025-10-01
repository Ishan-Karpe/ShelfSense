import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { base64 } = await request.json();

	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `In the given image there will be either one book or mulitple books displayed. Please give me back a JSON and ONLY A JSON SO NOTHING ELSE. 
					Please only give me back a vaild json since this will be handled internally in a program and will crash if any other text comes back with your response. 
					
					What I need as information is the books that you can see in the image in this form:
					{
					"bookTitle": "replace this with title of the book",
					"author": "replace this with author of the book"
					}

					Example:
					{
					"bookTitle": "Harry Potter and the Deathly Hallows",
					"author": "J.K. Rowling"
					}
					
					Please also make sure that you return an array, even if there is one book in the image. Thank you!`
					},
					{
						type: 'image_url',
						image_url: {
							url: `data:image/jpeg;base64,${base64}`,
							detail: 'low'
						}
					}
				]
			}
		]
	});

	const rawContent = response.choices[0].message.content;
	console.log('🤖 OpenAI raw response:', rawContent);

	const bookArrayString = rawContent?.replace(/```json|```/g, '').trim();
	const bookArray = JSON.parse(bookArrayString || '');

	// Transform bookAuthor to author if OpenAI uses different field name
	const normalizedBooks = bookArray.map(
		(book: { bookTitle?: string; title?: string; author?: string; bookAuthor?: string }) => ({
			bookTitle: book.bookTitle || book.title,
			author: book.author || book.bookAuthor
		})
	);

	console.log('📚 Parsed book array:', bookArray);
	console.log('✅ Normalized books:', normalizedBooks);
	console.log('📚 First book structure:', normalizedBooks[0]);

	const responseData = { bookArray: normalizedBooks };
	console.log('🚀 SENDING TO FRONTEND:', JSON.stringify(responseData, null, 2));

	return json(responseData);
};
