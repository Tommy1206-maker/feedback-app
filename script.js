document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const userInput = document.getElementById('userInput');
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  
  // ★★★★★ ここに、あなたがメモしたGASのウェブアプリURLを貼り付けます ★★★★★
  const GAS_WEB_APP_URL = 'https://script.google.com/a/macros/tsuchiura.ed.jp/s/AKfycbxUOoHY1M7-IQzS0yev5E68FsLsUkn9sloa8ss_1Xvl_eGTaK5F5tmzA4TP6FJB4l7Z/exec';

  submitBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text.trim()) {
      alert('何か文章を書いてね！');
      return;
    }

    // ローディング画面を表示し、ボタンを無効化
    loadingDiv.classList.remove('hidden');
    resultDiv.innerHTML = '';
    submitBtn.disabled = true;

    try {
      // GASにデータを送信
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        // GASに送信するデータ本体。入力された文章のみを送ります。
        body: JSON.stringify({
          text: text 
        })
      });

      // GASからの返事を受け取る
      const data = await response.json();

      // もしエラーが返ってきたら、エラーメッセージを表示
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Geminiからの返事をきれいに表示
      resultDiv.innerHTML = marked.parse(data.feedback);

    } catch (error) {
      // 通信失敗などのエラーメッセージを表示
      resultDiv.innerHTML = `<p style="color: red;">エラーが発生しました: ${error.message}</p>`;
    } finally {
      // ローディング画面を隠し、ボタンを有効に戻す
      loadingDiv.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });
});