from flask import Blueprint, jsonify, request
from tqdm import trange

from pytorch_pretrained_bert import BertForMaskedLM, BertTokenizer, GPT2LMHeadModel, GPT2Tokenizer
import torch
import torch.nn.functional as F

mod_api = Blueprint("api", __name__, url_prefix="/api")

LENGTH = 128
MODEL_NAME = "gpt2-medium"
TEMPERATURE = 1
TOP_K = 0

device = torch.device("cpu")
enc = GPT2Tokenizer.from_pretrained(MODEL_NAME)
model = GPT2LMHeadModel.from_pretrained(MODEL_NAME)
model.to(device)
model.eval()

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertForMaskedLM.from_pretrained('bert-base-uncased')
bert_model.eval()

def top_k_logits(logits, k):
    """
    Masks everything but the k top entries as -infinity (1e10).
    Used to mask logits such that e^-infinity -> 0 won't contribute to the
    sum of the denominator.
    """
    if k == 0:
        return logits
    else:
        values = torch.topk(logits, k)[0]
        batch_mins = values[:, -1].view(-1, 1).expand_as(logits)
        return torch.where(logits < batch_mins, torch.ones_like(logits) * -1e10, logits)

def sample_sequence(model, length, start_token=None, batch_size=1, context=None):
    if start_token is None:
        context = torch.tensor(context, device="cpu", dtype=torch.long).unsqueeze(0).repeat(batch_size, 1)
    else:
        context = torch.full((batch_size, 1), start_token, device=device, dtype=torch.long)

    prev = context
    output = context
    past = None
    with torch.no_grad():
        for i in trange(length):
            logits, past = model(prev, past=past)
            logits = logits[:, -1, :] / TEMPERATURE
            logits = top_k_logits(logits, k=TOP_K)
            log_probs = F.softmax(logits, dim=-1)
            prev = torch.multinomial(log_probs, num_samples=1)
            output = torch.cat((output, prev), dim=1)
    return output

@mod_api.route("/continue", methods=["GET"])
def continue_text():
    try:
        context = request.args.get("context")
    except:
        context = None

    if context is None or len(context) == 0:
        out = sample_sequence(
            model=model,
            length=LENGTH,
            start_token=enc.encoder["<|endoftext|>"]
        )

        out = out[:, 1:].tolist()
    else:
        context_tokens = enc.encode(context)
        out = sample_sequence(
            model=model,
            length=LENGTH,
            context=context_tokens
        )

        out = out[:, len(context_tokens):].tolist()

    text = enc.decode(out[0])

    return jsonify({
        "text": text
    })

@mod_api.route("/predict", methods=["GET"])
def predict_missing_token():
    sentence = request.args.get("sentence")
    tokenized_text = tokenizer.tokenize("[CLS] {} [SEP]".format(sentence))
    indexed_tokens = tokenizer.convert_tokens_to_ids(tokenized_text)

    segments_ids = [0] * len(tokenized_text)
    tokens_tensor = torch.tensor([indexed_tokens])
    segment_tensors = torch.tensor([segments_ids])

    with torch.no_grad():
        predictions = bert_model(tokens_tensor, segment_tensors)

    masked_index = tokenized_text.index("[MASK]")
    predicted_indices = torch.argsort(predictions[0, masked_index])[-10:].tolist()[::-1]
    predicted_tokens = tokenizer.convert_ids_to_tokens(predicted_indices)

    return jsonify({
        "tokens": predicted_tokens,
        "log_probabilities": predictions[0, masked_index, predicted_indices].tolist()
    })
