import fs from 'fs';
import path from 'path';

const distPath = 'c:/Users/emanu/.gemini/antigravity/brain/48564626-8804-4e62-b558-1fd8df1d6e86/Nova pasta/dist/index.html';

try {
    if (fs.existsSync(distPath)) {
        let content = fs.readFileSync(distPath, 'utf8');
        const Timestamp = Date.now();

        // 1. Force Title Update
        content = content.replace(/<title>.*?<\/title>/, '<title>Aequus Financial Coach v1.25.0</title>');

        // 2. Inject Query Params to JS/CSS (Aggressive Timestamp)
        // Replaces src="..." with src="...?v=1.25.0&t=TIMESTAMP"
        content = content.replace(/src="([^"]+?\.js)"/g, `src="$1?v=1.25.0&t=${Timestamp}"`);
        content = content.replace(/href="([^"]+?\.css)"/g, `href="$1?v=1.25.0&t=${Timestamp}"`);

        fs.writeFileSync(distPath, content);
        console.log(`Post-build: Injected v1.25.0 cache busters (t=${Timestamp}) into dist/index.html`);
    } else {
        console.error('Post-build: dist/index.html not found!');
        process.exit(1);
    }
} catch (e) {
    console.error('Post-build error:', e);
    process.exit(1);
}
