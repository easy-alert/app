export const uploadFile = async (file: { uri: string; type: string; name: string }): Promise<string | null> => {
  try {
    const formData = new FormData();

    // Certifique-se de adicionar a chave "file" ao FormData
    formData.append("file", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const response = await fetch(`https://easyalert-production.herokuapp.com/api/company/upload/file`, {
      method: "POST",
      headers: {
        Accept: "application/json", // Apenas Accept; FormData já lida com Content-Type
      },
      body: formData,
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error("Erro no servidor:", responseBody);
      throw new Error(`Erro do servidor: ${response.status}`);
    }

    const data = await response.json();

    return data.Location;
  } catch (error) {
    console.error("Erro ao realizar upload do arquivo:", error);
    return null;
  }
};
