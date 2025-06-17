const form = document.getElementById('updateForm');
const result = document.getElementById('result');

// Ganti ini dengan data repo kamu
const token = 'ghp_xxXTOKENANDAxx'; // !!! JANGAN taruh di file publik saat produksi
const repo = 'NAMAMU/live-porprov';
const filename = 'live-update.json';
const apiURL = `https://api.github.com/repos/${repo}/contents/${filename}`;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const judul = document.getElementById('judul').value.trim();
  const isi = document.getElementById('isi').value.trim();
  const waktu = new Date().toISOString();

  result.textContent = 'Mengirim...';

  try {
    // Ambil isi JSON lama
    const res = await fetch(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const data = await res.json();
    const content = JSON.parse(atob(data.content));

    // Tambahkan update baru
    content.updates.push({ waktu, judul, isi });

    const updatedContent = {
      message: `Menambahkan update: ${judul}`,
      content: btoa(JSON.stringify(content, null, 2)),
      sha: data.sha
    };

    // Kirim update ke GitHub
    const updateRes = await fetch(apiURL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(updatedContent)
    });

    if (updateRes.ok) {
      result.textContent = '✅ Update berhasil dikirim!';
      form.reset();
    } else {
      throw new Error('Gagal update JSON di GitHub.');
    }
  } catch (err) {
    console.error(err);
    result.textContent = '❌ Gagal mengirim update.';
  }
});
