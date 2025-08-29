;; A contract to store and retrieve proof-of-existence hashes.

;; --- Data Storage ---
;; A map where the key is a file hash (string-utf8 64) and the value is the principal who stored it.
(define-map proofs (string-utf8 64) principal)

;; --- Public Functions ---
;; @desc Stores a proof hash on the blockchain, associating it with the sender.
;; @param hash: The 64-character hex string of the file hash.
;; @returns (response bool)
(define-public (store-proof (hash (string-utf8 64)))
  (begin
    (asserts! (is-none (map-get? proofs hash)) (err u100)) ;; err: proof already exists
    (map-set proofs hash tx-sender)
    (ok true)
  )
)

;; --- Read-Only Functions ---
;; @desc Retrieves the principal that stored a given proof hash.
;; @param hash: The 64-character hex string to look up.
;; @returns (response (optional principal) uint)
(define-read-only (get-proof (hash (string-utf8 64)))
  (ok (map-get? proofs hash))
)