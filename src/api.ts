// Use relative path and Vite proxy so frontend doesn't reference `process` at runtime
export async function postSale(formData: FormData) {
  const resp = await fetch(`/api/sales/`, {
    method: 'POST',
    body: formData,
  });
  return resp.json();
}

export default {
  postSale,
};
