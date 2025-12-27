const OUTER_WORDS = [
	"therapists",
	"ovaries",
	"high heels",
	"dopamine",
	"reality",
];

const PAIRS: Record<string, string[]> = {
	duvet: ["escape", "philosophy", "loving"],
	"cup of tea": ["philosophy", "zen"],
	escape: ["illusion", "forever", "sweet", "dopamine"],
	"go to bed": ["mess"],
	reality: ["illusion", "awkward", "zen"],
	mistake: ["audience", "high heels", "mystery", "zen"],
	tripping: ["awkward"],
	"high heels": ["tripping", "dopamine"],
	chemistry: ["sun", "dopamine", "smash", "rubber coat"],
	"rubber coat": ["chemistry", "death drop", "spaceship", "flesh"],
	dopamine: ["high heels", "cup of tea", "escape", "death drop", "sucker"],
	philosophy: ["believer", "fool", "duvet", "cup of tea"],
	sweatpants: ["smash", "philosophy"],
	flesh: ["body", "rubber coat", "flash"],
	mess: ["loving", "death drop", "flowers", "go to bed"],
	sweet: ["escape", "awkward", "dumb"],
	sucker: ["believer", "dopamine"],
	civilised: ["devoted", "dumb"],
	zen: ["reality", "mistake", "cup of tea"],
	sun: ["flash", "sin", "prayers", "chemistry"],
	brave: ["dumb"],
	mystery: ["believer"],
	flowers: ["sin", "forever"],
	loving: ["prayers", "mess"],
	glitter: ["go to bed"],
};

const INNER_WORDS = ["example", "devotion", "beliefs", "feelings", "f*ck"];

const CENTER_WORDS = ["robyn"];

export function getVennBounds(size: number, count: 2 | 3) {
	const overlap = size / 3;

	if (count === 2) {
		return {
			width: size + (overlap / 1.25) * 2,
			height: size,
		};
	}

	return {
		width: size + overlap * 2,
		height: size + overlap * 1.25,
	};
}

function getRandom(list: string[]) {
	if (!list.length) return "";
	return list[Math.floor(Math.random() * list.length)];
}

export function generateRandomVenn(count: 2 | 3) {
	if (count === 2) {
		// Structure: [left-only, overlap, right-only]
		return [
			getRandom(OUTER_WORDS),
			getRandom(CENTER_WORDS),
			getRandom(OUTER_WORDS),
		];
	}

	// 3 circle venn has 7 sections in a fixed layout
	// 0: Top only (outer)
	// 1: Bottom-left only (outer)
	// 2: Bottom-right only (outer)
	// 3: Top ∩ Bottom-left (inner)
	// 4: Top ∩ Bottom-right (inner)
	// 5: Bottom-left ∩ Bottom-right (inner)
	// 6: Center (center)

	return [
		getRandom(OUTER_WORDS),
		getRandom(OUTER_WORDS),
		getRandom(OUTER_WORDS),
		getRandom(INNER_WORDS),
		getRandom(INNER_WORDS),
		getRandom(INNER_WORDS),
		getRandom(CENTER_WORDS),
	];
}

export function generateSmartVenn2() {
	const keys = Object.keys(PAIRS);
	const left = keys[Math.floor(Math.random() * keys.length)];
	const overlapOptions = PAIRS[left];
	const overlap =
		overlapOptions[Math.floor(Math.random() * overlapOptions.length)];

	// Pick right word not equal to left or overlap
	let right: string;
	do {
		right = keys[Math.floor(Math.random() * keys.length)];
	} while (right === left || right === overlap);

	return [left, overlap, right];
}

export function generateSmartVenn3() {
	const keys = Object.keys(PAIRS);
	const outer: string[] = [];
	// Pick 3 unique outer words
	while (outer.length < 3) {
		const candidate = keys[Math.floor(Math.random() * keys.length)];
		if (!outer.includes(candidate)) outer.push(candidate);
	}

	// helper to find intersection between two words
	const intersect = (a: string, b: string) => {
		const aPairs = PAIRS[a] || [];
		const bPairs = PAIRS[b] || [];
		const common = aPairs.filter((x) => bPairs.includes(x));
		return common.length
			? getRandom(common)
			: getRandom([...aPairs, ...bPairs]);
	};

	const topLeft = intersect(outer[0], outer[1]);
	const topRight = intersect(outer[0], outer[2]);
	const bottomRight = intersect(outer[1], outer[2]);
	// Center: ideally a word in all three sets
	const centerCandidates = (PAIRS[outer[0]] || []).filter(
		(x) => PAIRS[outer[1]]?.includes(x) && PAIRS[outer[2]]?.includes(x)
	);
	const center = centerCandidates.length
		? getRandom(centerCandidates)
		: getRandom([
				...PAIRS[outer[0]],
				...PAIRS[outer[1]],
				...PAIRS[outer[2]],
		  ]);

	return [...outer, topLeft, topRight, bottomRight, center];
}
