// Formato de respuesta de la API del curso (informe, sección Frontend)
export interface ResponseBase<T> {
  isSuccess: boolean;
  errorCode: string;
  errorMessage: string;
  data: T;
}
