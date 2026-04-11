-- TOP 1000 current holders (true UTXO balance per address)

WITH latest AS (
  SELECT c.*
  FROM minima_archive.coins c
  JOIN (
    SELECT coinid, MAX(mmrentrynumber) AS maxmmr
    FROM minima_archive.coins
    WHERE tokenid = '0x00'
    GROUP BY coinid
  ) m
    ON m.coinid = c.coinid
   AND m.maxmmr  = c.mmrentrynumber
  WHERE c.tokenid = '0x00'
)
SELECT
  address,
  SUM(amountdouble) AS balance_minima,
  COUNT(*)          AS utxos
FROM latest
WHERE spent = 0
  AND address NOT LIKE '0xDEAD%'  -- optional noise filter
  AND address NOT LIKE '0xdead%'
GROUP BY address
ORDER BY balance_minima DESC
LIMIT 1000;

