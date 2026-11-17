# Campusward 使用指南

第九週作業，用 AGENTS.md 約定寫法與頁面格式，做一個能持續加內容的使用指南，這是獨立示範網站，沒有修改或部署 Campusward 本體。

## 開啟

需要 Node.js 20 以上，不用安裝套件，在此資料夾執行：

```sh
npm run check
npm run start
```

瀏覽器開啟 http://127.0.0.1:4179 ，結束預覽時在終端機按 Ctrl+C，也可以直接開 `index.html`，直接開檔時複製按鈕可能受瀏覽器限制，畫面會提示手動複製。

## 內容

- `index.html`：開始使用
- `guides/schedule.html`：搜尋與排課
- `guides/ai-assistant.html`：小山 AI 與固定回覆示範
- `guides/faq.html`：沿用規則新增的第四頁，使用原生問答開合
- `AGENTS.md`：目的、視覺、命名、頁面格式、導覽與新增頁面範例
- `assets/`：共用樣式與互動
- `scripts/check.mjs`：檢查本機連結、錨點、資源與常見敏感資訊

沒有外部套件、追蹤、登入、真正 AI 呼叫或個人課表資料，示範只使用固定文字，複製只寫入使用者的剪貼簿。

## 擴充紀錄

先建立首頁、搜尋與排課、小山 AI 三頁，再照 AGENTS.md 同一格式增加 FAQ，第四頁沿用共用樣式、頁首、頁尾、下一篇與導覽，沒有新增樣式檔或外部套件。

這是頁面格式能擴充的實際例子，尚未宣稱另一個模型可在沒有人工協助下完成擴充。

## 來源與協助

內容取自 Campusward 公開的 [README](https://github.com/Hunter20041004/campusward-nccu/blob/main/README.md) 與 [DESIGN.md](https://github.com/Hunter20041004/campusward-nccu/blob/main/DESIGN.md)，查閱日期 2026-11-17，以實際產品與學校最新規定為準，本作業由 AI 協助整理與製作。
