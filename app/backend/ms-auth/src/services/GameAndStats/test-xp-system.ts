// test-xp-system.ts

// Constants (match your real values)
const XP_SCALE = 100;
const LEVEL_GROWTH_RATE = 1.15;

// Mock stats repository
interface Stats {
	id: number;
	user_id: number;
	total_xp: number;
	level: number;
}

const mockStatsDB: Record<number, Stats> = {
	1: { id: 1, user_id: 101, total_xp: 0, level: 0 },
	2: { id: 2, user_id: 102, total_xp: 0, level: 0 },
	3: { id: 3, user_id: 103, total_xp: 500, level: 0 },
	4: { id: 4, user_id: 104, total_xp: 200, level: 0 },
};

class MockStatsRepository {
	async findByUserID(userID: number): Promise<Stats | null> {
		const stats = Object.values(mockStatsDB).find(s => s.user_id === userID);
		return stats || null;
	}

	async update(id: number, data: Partial<Stats>) {
		if (mockStatsDB[id]) {
			mockStatsDB[id] = { ...mockStatsDB[id], ...data };
		}
	}
}

// XP System Logic (copied from your code, slightly adapted)
class XPSystem {
	private XP_SCALE = XP_SCALE;
	private LEVEL_GROWTH_RATE = LEVEL_GROWTH_RATE;
	private statsRepository = new MockStatsRepository();

	private calculateXPGain(playerLevel: number, oppLevel: number, playerScore: number, oppScore: number): number {
		const BASE_XP = 50;
		const RESULT_FACTOR = playerScore > oppScore ? 1.5 : playerScore < oppScore ? 0.5 : 1.0;
		const DIFFICULTY_FACTOR = Math.max(Math.min(1 + (oppLevel - playerLevel) * 0.05, 2), 0.5);
		const SCORE_FACTOR = Math.max(Math.min(1 + Math.abs(playerScore - oppScore) * 0.05, 2), 0.5);
		return BASE_XP * RESULT_FACTOR * DIFFICULTY_FACTOR * SCORE_FACTOR;
	}

	private levelFromXP(xp: number): number {
		if (xp <= 0) return 0;
		return Math.floor(Math.log((xp / this.XP_SCALE) + 1) / Math.log(this.LEVEL_GROWTH_RATE));
	}

	private calculateXPLevelUpdate(currentXP: number, XPGain: number) {
		const newXP = currentXP + XPGain;
		const currentLevel = this.levelFromXP(currentXP);
		const newLevel = this.levelFromXP(newXP);
		const levelGain = newLevel - currentLevel;

		return {
			currentXP,
			newXP,
			XPGain,
			currentLevel,
			newLevel,
			levelGain,
		};
	}

	public async applyGame(ID_P1: number, SCORE_P1: number, ID_P2: number, SCORE_P2: number) {
		const STATS_P1 = await this.statsRepository.findByUserID(ID_P1);
		const STATS_P2 = await this.statsRepository.findByUserID(ID_P2);
		if (!STATS_P1 || !STATS_P2) {
			console.log('User not found');
			return;
		}

		const XP_P1 = STATS_P1.total_xp;
		const XP_P2 = STATS_P2.total_xp;

		const LVL_P1 = this.levelFromXP(XP_P1);
		const LVL_P2 = this.levelFromXP(XP_P2);

		const XP_GAIN_P1 = this.calculateXPGain(LVL_P1, LVL_P2, SCORE_P1, SCORE_P2);
		const XP_GAIN_P2 = this.calculateXPGain(LVL_P2, LVL_P1, SCORE_P2, SCORE_P1); // Note: scores swapped!

		const UPDATE_P1 = this.calculateXPLevelUpdate(XP_P1, XP_GAIN_P1);
		const UPDATE_P2 = this.calculateXPLevelUpdate(XP_P2, XP_GAIN_P2);

		await this.statsRepository.update(STATS_P1.id, {
			level: UPDATE_P1.newLevel,
			total_xp: UPDATE_P1.newXP,
		});

		await this.statsRepository.update(STATS_P2.id, {
			level: UPDATE_P2.newLevel,
			total_xp: UPDATE_P2.newXP,
		});

		console.log(`\n=== Match: User ${ID_P1} vs User ${ID_P2} ===`);
		console.log(`Scores: ${SCORE_P1} - ${SCORE_P2}`);
		console.log(`P1 (ID ${ID_P1}): XP ${XP_P1} → ${UPDATE_P1.newXP}, Level ${UPDATE_P1.currentLevel} → ${UPDATE_P1.newLevel} (+${UPDATE_P1.levelGain})`);
		console.log(`P2 (ID ${ID_P2}): XP ${XP_P2} → ${UPDATE_P2.newXP}, Level ${UPDATE_P2.currentLevel} → ${UPDATE_P2.newLevel} (+${UPDATE_P2.levelGain})`);
	}
}

// Test runner
async function runTests() {
	const system = new XPSystem();

	// Reset mock DB before each test run
	Object.assign(mockStatsDB, {
		1: { id: 1, user_id: 101, total_xp: 0, level: 0 },
		2: { id: 2, user_id: 102, total_xp: 0, level: 0 },
		3: { id: 3, user_id: 103, total_xp: 500, level: 0 },
		4: { id: 4, user_id: 104, total_xp: 200, level: 0 },
	});

	console.log('🧪 Starting XP System Tests...\n');

	// Test 1: New players, P1 wins
	await system.applyGame(101, 10, 102, 5);

	// Test 2: Tie
	await system.applyGame(101, 8, 102, 8);

	// Test 3: Higher XP player (ID 103) vs lower (ID 104), upset win
	await system.applyGame(104, 10, 103, 7); // lower XP player wins

	// Test 4: Same level, big score difference
	await system.applyGame(101, 15, 102, 2);

	console.log('\n✅ All tests completed.');
	console.log('\n📊 Final Stats:');
	Object.values(mockStatsDB).forEach(s => {
		console.log(`User ${s.user_id}: XP=${s.total_xp.toFixed(2)}, Level=${s.level}`);
	});
}

// Run if called directly
if (require.main === module) {
	runTests().catch(console.error);
}
