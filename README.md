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

## 本機執行（Local Run）

此專案為純靜態網站，無需安裝任何套件。

1. 啟動本機靜態伺服器：

   ```bash
   python3 -m http.server 8000
   ```

2. 於瀏覽器開啟 `http://localhost:8000`。
3. 若 8000 埠被占用，可改用：

   ```bash
   python3 -m http.server 8080
   ```

## 驗證方式（Validation）

請依序完成以下驗證：

1. 基本計時：確認 Start / Pause / Reset 可操作，模式可在 Focus / Short Break / Long Break 間切換。
2. 響應式檢查：瀏覽器開發者工具切換到 `390x844` 與 `1280x800`，確認排版無重疊且按鈕可正常點擊。
3. 鍵盤可用性：使用 Tab / Shift+Tab / Enter 導覽主要控制與設定表單，確認焦點樣式清楚可見。
4. 完成提示：讓任一回合倒數到 0，確認畫面有明顯完成提示（高亮）且可聽到提示音。
5. 設定持久化：修改分鐘數後儲存並重新整理頁面，確認設定與當日 focus 統計仍保留。

> 音效限制：部分瀏覽器會在未有使用者互動時封鎖自動播放音效；此時仍會顯示視覺完成提示與文字訊息。

## 部署（GitHub Pages）

1. 將變更推送到 GitHub 預設分支（通常為 `main`）。
2. 進入 Repository → **Settings** → **Pages**。
3. Build and deployment 的 Source 選擇 **Deploy from a branch**。
4. Branch 選擇 `main`，資料夾選擇 `/ (root)`，按下 **Save**。
5. 等待部署完成後，於 Pages 顯示的網站網址開啟（本專案通常為 `https://aw-apps.github.io/focus-pomodoro-web/`）。
