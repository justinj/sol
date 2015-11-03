import fact from './fact';

// TODO: this could be probs be optimized somehow
export default function(n, k) {
  if (n < k) {
    return 0;
  } else {
    return fact(n)/(fact(k)*fact(n-k));
  }
}
