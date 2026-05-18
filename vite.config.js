import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/<레포지토리-이름>/', // 예: 레포지토리 이름이 my-web 이라면 '/my-web/' 으로 작성
})
