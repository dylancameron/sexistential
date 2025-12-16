const OUTER_WORDS = [
	"therapists",
	"ovaries",
	"high heels",
	"dopamine",
	"reality",
];

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
