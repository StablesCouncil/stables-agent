-- ============================================================
-- PARAMETERS — edit only this CTE
-- ============================================================
WITH params AS (
  SELECT
    '0x4AD25252814256BEDDF7EA6F0CF75E48FC10E8D11FE3FC70551BB427A2BBA84A' AS address,
    '2023-01-01'  AS date_from,
    '2026-04-18'  AS date_to,
    'MONTH'       AS interval_type  -- DAY | WEEK | MONTH | QUARTER | YEAR
),
-- ============================================================

-- Latest canonical MMR state per coin for this address
latest_coins AS (
  SELECT c.coinid, c.amountdouble, c.spent, c.blockcreated, c.blockspent
  FROM minima_archive.coins c
  JOIN (
    SELECT coinid, MAX(mmrentrynumber) AS maxmmr
    FROM minima_archive.coins
    WHERE tokenid = '0x00'
      AND address = (SELECT address FROM params)
    GROUP BY coinid
  ) m ON m.coinid = c.coinid AND m.maxmmr = c.mmrentrynumber
  WHERE c.tokenid = '0x00'
    AND c.address = (SELECT address FROM params)
),

-- Real block timeline from coins.date (syncblock.timemilli is wrong — ingestion date)
day_max_block AS (
  SELECT
    DATE(STR_TO_DATE(date, '%d/%m/%Y %H:%i:%s')) AS snap_date,
    MAX(blockcreated)                             AS max_block
  FROM minima_archive.coins
  WHERE tokenid = '0x00'
    AND DATE(STR_TO_DATE(date, '%d/%m/%Y %H:%i:%s'))
        BETWEEN (SELECT date_from FROM params)
            AND (SELECT date_to   FROM params)
  GROUP BY DATE(STR_TO_DATE(date, '%d/%m/%Y %H:%i:%s'))
),

-- Roll up into chosen interval
bucketed AS (
  SELECT
    CASE (SELECT interval_type FROM params)
      WHEN 'DAY'     THEN snap_date
      WHEN 'WEEK'    THEN DATE(DATE_SUB(snap_date, INTERVAL WEEKDAY(snap_date) DAY))
      WHEN 'MONTH'   THEN DATE(DATE_FORMAT(snap_date, '%Y-%m-01'))
      WHEN 'QUARTER' THEN DATE(CONCAT(YEAR(snap_date), '-',
                           LPAD((QUARTER(snap_date)-1)*3+1, 2, '0'), '-01'))
      WHEN 'YEAR'    THEN DATE(DATE_FORMAT(snap_date, '%Y-01-01'))
    END            AS period_start,
    MAX(max_block) AS period_max_block
  FROM day_max_block
  GROUP BY period_start
)

SELECT
  b.period_start,
  COALESCE(SUM(lc.amountdouble), 0) AS balance_minima,
  COUNT(lc.coinid)                   AS utxo_count
FROM bucketed b
LEFT JOIN latest_coins lc
  ON  lc.blockcreated <= b.period_max_block
  AND (lc.spent = 0 OR lc.blockspent > b.period_max_block)
GROUP BY b.period_start
ORDER BY b.period_start ASC;
