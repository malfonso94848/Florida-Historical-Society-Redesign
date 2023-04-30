CREATE TABLE `events` (
  `event_id` bigint(20) NOT NULL,
  `event_start` datetime NOT NULL,
  `event_end` datetime NOT NULL,
  `event_text` text NOT NULL,
  `event_color` varchar(7) NOT NULL,
  `event_background` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `event_start` (`event_start`),
  ADD KEY `event_end` (`event_end`);

ALTER TABLE `events`
  MODIFY `event_id` bigint(20) NOT NULL AUTO_INCREMENT;