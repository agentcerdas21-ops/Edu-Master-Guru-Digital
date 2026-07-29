import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini API client lazy/safe
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Routes for Edu Master AI
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Edu Master AI", time: new Date().toISOString() });
  });

  // AI Assistant endpoint
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { type, prompt, context } = req.body;
      const ai = getAiClient();

      let systemInstruction = `Kamu adalah Software Architect & AI Pedagogi Senior untuk Kurikulum Merdeka Indonesia.
Tugasmu adalah menghasilkan dokumen administrasi guru yang profesional, terstruktur, lengkap, dan sesuai standar Kemendikbudristek Indonesia.
Gunakan Bahasa Indonesia yang baku, sopan, dan akademis.`;

      let userPrompt = prompt;

      if (type === "modul_ajar") {
        systemInstruction += ` Buat Modul Ajar Kurikulum Merdeka yang sangat detail.
Kembalikan respon dalam format JSON sesuai struktur berikut:
{
  "title": "Judul Modul",
  "subject": "Mata Pelajaran",
  "gradeLevel": "Kelas/Fase",
  "duration": "Alokasi Waktu (misal: 2 JP x 45 Menit)",
  "cp": "Capaian Pembelajaran",
  "tp": ["Tujuan Pembelajaran 1", "Tujuan Pembelajaran 2"],
  "profilPancasila": ["Beriman", "Gotong Royong", "Bernalar Kritis"],
  "mediaPembelajaran": ["Laptop", "Proyektor", "LKPD"],
  "targetPesertaDidik": "Peserta Didik Reguler",
  "modelPembelajaran": "Problem Based Learning (PBL)",
  "pemahamanBermakna": "Penjelasan pemahaman bermakna",
  "pertanyaanPemantik": ["Pertanyaan 1", "Pertanyaan 2"],
  "kegiatanAwal": ["Langkah 1 (10 menit)", "Langkah 2"],
  "kegiatanInti": ["Orientasi masalah", "Mengorganisasi siswa", "Penyelidikan"],
  "kegiatanPenutup": ["Refleksi", "Penutupan"],
  "asesmen": {
    "diagnostik": "Penilaian awal",
    "formatif": "Penilaian proses",
    "sumatif": "Penilaian akhir"
  },
  "remedialAndPengayaan": "Rencana remedial dan pengayaan"
}`;
        userPrompt = `Buatkan Modul Ajar untuk topik/materi: "${prompt}". Context tambahan: ${JSON.stringify(context || {})}`;
      } else if (type === "atp_cp") {
        systemInstruction += ` Hasilkan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan Alur Tujuan Pembelajaran (ATP).
Format JSON:
{
  "fase": "Fase D",
  "materi": "Materi Utama",
  "cp": "Capaian Pembelajaran Elemen",
  "tpList": [
    { "code": "TP 1.1", "description": "Deskripsi TP 1", "alokasiWaktu": "4 JP", "kataKunci": "Kata kunci" }
  ],
  "atpOrder": ["TP 1.1", "TP 1.2"]
}`;
      } else if (type === "lkpd") {
        systemInstruction += ` Hasilkan Lembar Kerja Peserta Didik (LKPD) yang siap cetak.
Format JSON:
{
  "title": "LKPD Interaktif",
  "subject": "Mata Pelajaran",
  "grade": "Kelas",
  "petunjuk": ["Petunjuk 1", "Petunjuk 2"],
  "materiRingkas": "Ringkasan materi singkat",
  "tugasIndividu": ["Soal / Tugas 1", "Soal / Tugas 2"],
  "tugasKelompok": ["Instruksi diskusi kelompok"],
  "rubrikPenilaian": "Kriteria penilaian singkat"
}`;
      } else if (type === "bank_soal") {
        systemInstruction += ` Hasilkan Paket Soal Evaluasi lengkap dengan Kisi-kisi, Kartu Soal, Pembahasan, dan Kunci Jawaban.
Sertakan level Taksonomi Bloom (C1-C6) untuk setiap soal.
Format JSON:
{
  "kisiKisi": "Kisi-kisi asesmen",
  "soalList": [
    {
      "id": 1,
      "type": "pg",
      "levelBloom": "C3",
      "question": "Pertanyaan soal",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correctAnswer": "A",
      "explanation": "Pembahasan lengkap"
    }
  ]
}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      let textOutput = response.text || "";
      let jsonResult = null;
      try {
        // Clean markdown code fence if present
        let cleaned = textOutput.trim();
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
        }
        jsonResult = JSON.parse(cleaned);
      } catch (err) {
        jsonResult = { rawText: textOutput };
      }

      res.json({ success: true, result: jsonResult, rawText: textOutput });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ success: false, error: error.message || "Gagal menghasilkan respon AI" });
    }
  });

  // Chat assistant endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const ai = getAiClient();

      const promptHistory = messages.map((m: any) => `${m.role === "user" ? "User" : "Asisten"}: ${m.content}`).join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptHistory,
        config: {
          systemInstruction: `Kamu adalah Edu Master AI Assistant, asisten ahli administrasi guru Indonesia (Kurikulum Merdeka & Kurikulum 2013).
Kamu ramah, cekatan, dan dapat membantu guru membuat Modul Ajar, RPP, LKPD, Kisi-kisi Soal, Rubrik Penilaian, Analisis Hasil Belajar, Saran Remedial & Pengayaan, serta memberikan konsultasi metode pembelajaran aktif.`,
        },
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ success: false, error: error.message || "Gagal memproses percakapan AI" });
    }
  });

  // Vite middleware for dev or static files for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Edu Master AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
