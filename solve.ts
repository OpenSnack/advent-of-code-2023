import jiti from 'jiti';

(async () => {
    jiti(__filename)(`./${process.argv[2]}/solution.ts`);
})();
