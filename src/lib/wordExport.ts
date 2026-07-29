import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';

export async function exportModulAjarWord(modul: any, filename = 'Modul_Ajar.docx') {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'MODUL AJAR KURIKULUM MERDEKA',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Judul Modul: ', bold: true }),
              new TextRun({ text: modul.title }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Mata Pelajaran: ', bold: true }),
              new TextRun({ text: modul.subject_name || '-' }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Kelas / Fase: ', bold: true }),
              new TextRun({ text: `${modul.class_name || '-'} / Fase ${modul.phase}` }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Alokasi Waktu: ', bold: true }),
              new TextRun({ text: modul.duration || '-' }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Capaian Pembelajaran (CP)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: modul.cp || '-',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Tujuan Pembelajaran (TP)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 120 },
          }),
          ...(Array.isArray(modul.tp)
            ? modul.tp.map((tpItem: string) => new Paragraph({ text: `• ${tpItem}`, spacing: { after: 80 } }))
            : []),
          new Paragraph({
            text: 'Kegiatan Pembelajaran',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'A. Pendahuluan', bold: true })],
            spacing: { after: 80 },
          }),
          ...(Array.isArray(modul.kegiatan_awal)
            ? modul.kegiatan_awal.map((item: string) => new Paragraph({ text: `- ${item}`, spacing: { after: 60 } }))
            : []),
          new Paragraph({
            children: [new TextRun({ text: 'B. Kegiatan Inti', bold: true })],
            spacing: { before: 120, after: 80 },
          }),
          ...(Array.isArray(modul.kegiatan_inti)
            ? modul.kegiatan_inti.map((item: string) => new Paragraph({ text: `- ${item}`, spacing: { after: 60 } }))
            : []),
          new Paragraph({
            children: [new TextRun({ text: 'C. Penutup', bold: true })],
            spacing: { before: 120, after: 80 },
          }),
          ...(Array.isArray(modul.kegiatan_penutup)
            ? modul.kegiatan_penutup.map((item: string) => new Paragraph({ text: `- ${item}`, spacing: { after: 60 } }))
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportQuestionBankWord(questions: any[], subjectName = 'Matematika') {
  const children: any[] = [
    new Paragraph({
      text: `BANK SOAL & KARTU SOAL - ${subjectName.toUpperCase()}`,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
  ];

  questions.forEach((q, idx) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Soal No. ${idx + 1} `, bold: true }),
          new TextRun({ text: `(Taksonomi ${q.bloom_level} - ${q.difficulty})`, italics: true }),
        ],
        spacing: { before: 120, after: 80 },
      }),
      new Paragraph({ text: q.question_text || '', spacing: { after: 100 } })
    );

    if (Array.isArray(q.options)) {
      q.options.forEach((opt: any) => {
        children.push(
          new Paragraph({ text: `  ${opt.code}. ${opt.text}`, spacing: { after: 40 } })
        );
      });
    }

    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Kunci Jawaban: ${q.correct_answer}`, bold: true })],
        spacing: { before: 60, after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Pembahasan: ${q.explanation}`, italics: true })],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bank_Soal_${subjectName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
