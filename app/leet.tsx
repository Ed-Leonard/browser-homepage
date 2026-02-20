"use client";
import { useEffect, useState } from "react";

interface TopicTag {
	name: string;
}

interface Daily {
	date: string;
	link: string;
	question: {
		title: string;
		difficulty: string;
		titleSlug: string;
		acRate: number;
		topicTags: TopicTag[];
	};
}

export default function LeetDaily() {
	const [daily, setDaily] = useState<Daily | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/leetcode")
			.then((res) => res.json())
			.then((data) => {
				setDaily(data);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading...</p>;
	if (!daily) return <p>Failed to load.</p>;

	function difficultColour(difficulty: string) {
		switch (difficulty) {
			case 'Easy': return 'green';
			case 'Medium': return 'orange';
			case 'Hard': return 'text-red-500';
		}
	}

	return (
		<div>
			<h1 className='text-2xl font-bold'>{daily.question.title}</h1>
			<p className={`${difficultColour(daily.question.difficulty)}`}>{daily.question.difficulty}</p>
			<p>Date: {daily.date}</p>
			<p>AcRate: {daily.question.acRate.toFixed(1)}</p>
			<p>Topics: {daily.question.topicTags.map(tag => tag.name).join(', ')}</p>

			<a className='hover:underline' href={`https://leetcode.com${daily.link}`} target="_blank">
				Solve it
			</a>
		</div>
	);
}
