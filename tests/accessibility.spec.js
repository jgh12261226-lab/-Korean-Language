const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');

test.describe('국립국어원 메인 페이지 웹 접근성 테스트', () => {
  test('KWCAG 2.2 기준 접근성 위반 사항 검사', async ({ page }) => {
    // 1. 실행 중인 로컬 서버 접근 (Vite 기본 포트 5173 사용, 환경에 맞게 변경 가능)
    const targetUrl = 'http://localhost:5173/';
    
    try {
      await page.goto(targetUrl);
    } catch (error) {
      console.error(`로컬 서버(${targetUrl})에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.`);
      throw error;
    }

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 2. AxeBuilder를 사용하여 접근성 분석 수행
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']) // 검사할 WCAG 가이드라인 태그 지정
      .analyze();

    // 3. 위반 사항이 발견되면 소스 수정 전에 JSON 리포트로 추출
    if (accessibilityScanResults.violations.length > 0) {
      const reportPath = path.resolve(process.cwd(), 'accessibility-violations.json');
      
      fs.writeFileSync(
        reportPath,
        JSON.stringify(accessibilityScanResults.violations, null, 2),
        'utf-8'
      );
      
      console.log(`\n🚨 접근성 위반 사항이 발견되었습니다!`);
      console.log(`총 ${accessibilityScanResults.violations.length}건의 위반 항목이 추출되었습니다.`);
      console.log(`리포트 저장 경로: ${reportPath}\n`);
    }

    // 4. 테스트 결과 검증 (위반 사항 빈 배열 확인)
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
