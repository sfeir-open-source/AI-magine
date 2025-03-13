import { Inject, Injectable } from '@nestjs/common';
import { ImageGenerationClient } from '@/image-generation/domain';
import { helpers, PredictionServiceClient } from '@google-cloud/aiplatform';
import { google } from '@google-cloud/aiplatform/build/protos/protos';
import { ConfigurationService } from '@/configuration/configuration.service';
import IPredictRequest = google.cloud.aiplatform.v1.IPredictRequest;
import IPredictResponse = google.cloud.aiplatform.v1.IPredictResponse;

@Injectable()
export class ImagenImageGenerationClient implements ImageGenerationClient {
  private readonly endpoint: string;
  private readonly predictionServiceClient: PredictionServiceClient;

  constructor(
    @Inject()
    private readonly configurationService: ConfigurationService
  ) {
    if (!configurationService.getImagenGcpProjectID()) {
      throw new Error('Missing IMAGEN_GCP_PROJECT_ID');
    }
    if (!configurationService.getImagenRegion()) {
      throw new Error('Missing IMAGEN_REGION');
    }

    this.endpoint = `projects/${configurationService.getImagenGcpProjectID()}/locations/${configurationService.getImagenRegion()}/publishers/google/models/imagen-3.0-generate-001`;
    this.predictionServiceClient = new PredictionServiceClient({
      apiEndpoint: `${configurationService.getImagenRegion()}-aiplatform.googleapis.com`,
    });
  }

  private DEFAULT_IMAGE_REQUEST_PARAMS = {
    sampleCount: 1,
    addWatermark: true,
    watermarkText: 'SFEIR',
    aspectRatio: '16:9',
    safetySettings: {
      categoryAllowList: ['hate', 'harassment', 'sexualContent'],
      filterStrength: 'HIGH',
    },
  };

  async generateImageFromPrompt(prompt: string): Promise<string> {
    const request = this.createRequest(prompt);

    const [response] = await this.predictionServiceClient.predict(request);
    const predictions = response.predictions;

    this.validatePredictions(predictions);

    const imageBase64String =
      predictions &&
      predictions[0]?.structValue?.fields?.bytesBase64Encoded?.stringValue;

    if (!imageBase64String) {
      throw new Error('Generated image is invalid or missing.');
    }
    const imageBuffer = Buffer.from(imageBase64String, 'base64');
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  }

  private createRequest(prompt: string): IPredictRequest {
    const promptText = helpers.toValue({ prompt });
    const imageRequestParameters = helpers.toValue(
      this.DEFAULT_IMAGE_REQUEST_PARAMS
    );

    return {
      endpoint: this.endpoint,
      instances: [promptText],
      parameters: imageRequestParameters,
    } as IPredictRequest;
  }

  private validatePredictions(
    predictions: IPredictResponse['predictions']
  ): void {
    if (
      !predictions ||
      predictions.length === 0 ||
      !predictions[0]?.structValue?.fields?.bytesBase64Encoded?.stringValue
    ) {
      throw new Error(
        'No image was generated. Check the request parameters and prompt.'
      );
    }
  }
}
