"use client";
import { useEffect, useState } from "react";
import { format } from "date-and-time";

interface TopicTag {
	name: string;
}

interface Daily {
	date: string;
	link: string;
	question: {
		title: string;
		questionId: number;
		difficulty: string;
		topicTags: TopicTag[];
	};
}

const formatDate = (dateString: string) => {
	const dateArray = dateString.split("-");
	const date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]))

	const nth = (d: number) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	};

	return format(date, 'dddd. DD') + nth(parseInt(dateArray[2]));
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
			case 'Easy': return 'text-[#b8bb26]'
			case 'Medium': return 'text-[#fe8019]';
			case 'Hard': return 'text-[#fb4934]';
		}
	}

	return (
		<div className='p-2 pt-0.5 rounded-lg bg-[#3c3836]'>
			<div className='flex justify-center gap-4 items-center'>
				<h1 className='text-sm font-extralight font-mono'>DAILY LEETCODE</h1>
				<p className='text-sm font-mono font-extralight'>{formatDate(daily.date)}</p>
			</div>
			<a href={`https://leetcode.com${daily.link}`} className='block hover:border-[#b8bb26] border rounded-sm p-2' target='_blank'>
				<h1 className='text-xl max-w-64 mb-2 font-mono font-medium'>{daily.question.questionId} - {daily.question.title}</h1>
				<p className={`${difficultColour(daily.question.difficulty)} font-mono font-medium mb-2 text-sm`}>Difficulty: {daily.question.difficulty}</p>
				<div className='flex gap-2'>
					{daily.question.topicTags.map((tag, i) =>
						<div className='text-xs  bg-[#d3869b] text-[#3c3836] rounded-full p-1 font-mono font-medium' key={i}>{tag.name}</div>
					)}
				</div>
			</a>
		</div>
	);
}
