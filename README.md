# Focus Pomodoro Web

一個美觀、實用、可直接部署的番茄鐘網頁版，採用純 HTML/CSS/JavaScript 開發，支援 RWD，手機與桌機都能有良好體驗。

## 功能特色

- 專注 / 短休息 / 長休息三段模式
- 一鍵開始、暫停、重設、跳過
- 可調整工作與休息時長
- 每完成一輪自動累計番茄鐘數
- 本機儲存設定與每日統計（localStorage）
- 音效提示與頁面標題倒數顯示
- 手機優先 RWD 介面

## 技術選型

- HTML5
- CSS3（含響應式斷點與設計 Token）
- Vanilla JavaScript (ES6+)
- localStorage（持久化）

## 本機執行

此專案為純靜態網站，無需安裝依賴。

方式一：直接開啟 `index.html`。

方式二（建議）：

```bash
python3 -m http.server 8000
```

開啟 `http://localhost:8000`。

## 驗證方式

1. 桌機瀏覽器開啟頁面，確認可開始/暫停/重設計時。
2. 切換到手機尺寸（例如 390x844），確認排版完整、按鈕可點擊。
3. 修改時長後重新整理，確認設定有保留。
4. 完成一個專注回合後，確認統計數字更新。

## 部署（GitHub Pages）

1. 進入 GitHub Repository → Settings → Pages。
2. Source 選擇 `Deploy from a branch`。
3. Branch 選擇 `main` 與 `/ (root)`。
4. 部署完成後可由：
   `https://aw-apps.github.io/focus-pomodoro-web/` 存取。
