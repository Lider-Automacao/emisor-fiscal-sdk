import { EmissorFiscalApi } from "../../api/emissor-fiscal-api.service";
import { EnvioImpressao, EnvioImpressaoSchema } from "../../models";
import { EmissorFiscalError } from "../../utils/errors/emissor-fiscal.error";


export class ImprimirNfce {
  private readonly api: EmissorFiscalApi

  constructor(api: EmissorFiscalApi) {
    this.api = api;
  }

  async executa(request: EnvioImpressao): Promise<Buffer> {
    const parsedData = EnvioImpressaoSchema.safeParse(request);

    if (!parsedData.success) {
      throw EmissorFiscalError.fromZodError("Dados de envio inválidos", parsedData.error);
    }

    const response = await this.api.post<any, any>('/nfce/imprimir', parsedData.data, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response, 'binary')
  }
}