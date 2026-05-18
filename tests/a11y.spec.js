const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default; // 1

test.describe('웹 접근성 자동화 테스트', () => {
  test('메인 페이지 접근성 검사', async ({ page }) => {
    // 테스트할 로컬 서버 주소 또는 파일 경로를 입력하세요.
    // Vite를 사용하는 경우 일반적으로 http://localhost:5173 입니다.
    // 여기서는 프로젝트 구조에 맞춰 index.html 파일 경로를 사용할 수 있습니다.
    // 하지만 정확한 테스트를 위해서는 dev 서버를 실행하고 해당 URL로 접근하는 것이 좋습니다.
    
    // 임시로 로컬 파일을 불러옵니다 (실제 환경에서는 baseURL을 설정하고 '/' 경로로 접근).
    await page.goto(`file://${process.cwd().replace(/\\/g, '/')}/index.html`);

    // 접근성 검사 실행
    const accessibilityScanResults = await new AxeBuilder({ page })
      // 특정 규칙 제외 등 설정 가능
      // .disableRules(['color-contrast']) 
      .analyze();

    // 접근성 위반 사항이 없는지 확인
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
