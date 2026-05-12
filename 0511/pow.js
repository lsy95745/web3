const crypto = require('crypto');

// 配置信息
const nickname = "Toy"; // 请在此处替换你的昵称

/**
 * 执行 PoW 计算
 * @param {string} prefix - 目标前缀（例如 "0000"）
 */
function runPow(prefix) {
    let nonce = 0;
    let hash = "";
    let content = "";
    
    console.log(`\n>>> 开始计算，目标前缀: "${prefix}"`);
    const startTime = Date.now();

    while (true) {
        content = nickname + nonce;
        hash = crypto.createHash('sha256').update(content).digest('hex');

        if (hash.startsWith(prefix)) {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;

            console.log(`[成功] 满足 ${prefix.length} 个 0 的条件:`);
            console.log(`- 花费时间: ${timeSpent} 秒`);
            console.log(`- Hash 内容: ${content}`);
            console.log(`- Hash 值: ${hash}`);
            break;
        }
        nonce++;
        
        // 防止无限循环的安全保护（可选）
        if (nonce > 100000000) {
            console.log("计算量过大，已停止。");
            break;
        }
    }
}

// 任务 1: 满足 4 个 0 开头
runPow("0000");

// 任务 2: 满足 5 个 0 开头
runPow("00000");