const User = require('../models/User');

async function updateBankInterest() {
    try {
        const users = await User.find({ bank: { $gt: 0 } });
        const now = Date.now();

        for (let user of users) {
            if (!user.lastInterestTime) {
                user.lastInterestTime = now;
                await user.save();
                continue;
            }

            const hoursPassed = (now - user.lastInterestTime) / (1000 * 60 * 60);

            if (hoursPassed >= 1) {
                const hoursToCalculate = Math.floor(hoursPassed);
                const hourlyRate = 0.036 / 24; 
                
                let totalInterest = 0;
                for (let i = 0; i < hoursToCalculate; i++) {
                    totalInterest += user.bank * hourlyRate;
                }

                if (totalInterest > 0) {
                    user.bank = Math.floor(user.bank + totalInterest);
                }

                user.lastInterestTime = now - ((hoursPassed - hoursToCalculate) * 1000 * 60 * 60);
                await user.save();
            }
        }
    } catch (error) {
        console.error('❌ Lỗi khi tính lãi suất ngân hàng:', error);
    }
}

function startBankInterestCron() {
    // Chạy định kỳ mỗi 1 tiếng
    setInterval(updateBankInterest, 60 * 60 * 1000);
    console.log('📈 Đã kích hoạt tiến trình chạy ngầm tính lãi suất ngân hàng tự động!');
}

module.exports = { startBankInterestCron };