export async function GET() {
	const res = await fetch("https://leetcode.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Referer": "https://leetcode.com",
		},
		body: JSON.stringify({
			query: `
        query {
			activeDailyCodingChallengeQuestion {
				date
				link
				question {
					questionId
					title
					difficulty
					topicTags {
						name
					}
				}
			}
        }
      `,
		}),
	});

	const data = await res.json();
	return Response.json(data.data.activeDailyCodingChallengeQuestion);
}
