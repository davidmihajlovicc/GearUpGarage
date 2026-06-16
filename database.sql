

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `brands` (`id`, `NAME`) VALUES
(1, 'Audi'),
(2, 'BMW'),
(3, 'Peugeot'),
(4, 'Volkswagen');


CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `part_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `models` (`id`, `brand_id`, `NAME`) VALUES
(1, 1, 'A3'),
(2, 1, 'A4'),
(10, 1, 'A5'),
(11, 1, 'A6'),
(12, 1, 'A7'),
(13, 1, 'Q3'),
(3, 1, 'Q5'),
(14, 1, 'Q7'),
(15, 1, 'TT'),
(4, 2, '3 Series'),
(5, 2, '5 Series'),
(28, 3, '2008'),
(24, 3, '208'),
(29, 3, '3008'),
(25, 3, '308'),
(26, 3, '408'),
(30, 3, '5008'),
(27, 3, '508'),
(8, 4, 'Golf'),
(9, 4, 'Passat');



CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `part_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `part_type_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `year_from` smallint(6) DEFAULT NULL,
  `year_to` smallint(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `part_subtype_id` int(11) DEFAULT NULL,
  `fuel` enum('diesel','gas') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `parts` (`id`, `name`, `price`, `image`, `brand_id`, `model_id`, `part_type_id`, `title`, `year_from`, `year_to`, `created_at`, `part_subtype_id`, `fuel`) VALUES
(188, 'Oil filter premium', 22.00, '/uploads/audi_a3_oilfilter.jpg', 1, 1, 7, 'Oil filter', 2014, 2020, '2025-08-22 11:40:43', 15, 'gas'),
(189, 'Ceramic front brake pads', 85.00, '/uploads/audi_a3_frontpads.jpg', 1, 1, 2, 'Front brake pads', 2013, 2020, '2025-08-22 11:40:43', 6, 'diesel'),
(190, 'Rear shock absorber hydraulic', 145.00, '/uploads/audi_a3_rearshock.jpg', 1, 1, 3, 'Rear shock absorber', 2014, 2019, '2025-08-22 11:40:43', 9, 'diesel'),
(191, 'Air filter sport', 34.00, '/uploads/audi_a3_airfilter.jpg', 1, 1, 7, 'Air filter', 2013, 2020, '2025-08-22 11:40:43', 16, 'gas'),
(192, 'Complete clutch kit', 310.00, '/uploads/audi_a3_clutch.jpg', 1, 1, 4, 'Clutch kit', 2013, 2020, '2025-08-22 11:40:43', 11, 'diesel'),
(193, 'Timing belt kit', 240.00, '/uploads/audi_a4_timingbelt.jpg', 1, 2, 1, 'Timing belt kit', 2012, 2018, '2025-08-22 11:40:43', 1, 'diesel'),
(194, 'Front bumper primed', 295.00, '/uploads/audi_a4_frontbumper.jpg', 1, 2, 5, 'Front bumper', 2013, 2019, '2025-08-22 11:40:43', 13, 'gas'),
(195, 'Fuel filter diesel', 38.00, '/uploads/audi_a4_fuelfilter.jpg', 1, 2, 7, 'Fuel filter', 2012, 2018, '2025-08-22 11:40:43', 18, 'diesel'),
(196, 'Radiator with cooler', 225.00, '/uploads/audi_a4_radiator.jpg', 1, 2, NULL, 'Radiator', 2012, 2018, '2025-08-22 11:40:43', 21, 'gas'),
(197, 'Drive shaft right', 280.00, '/uploads/audi_a4_driveshaft.jpg', 1, 2, 8, 'Drive shaft', 2012, 2019, '2025-08-22 11:40:43', 19, 'diesel'),
(198, 'Alternator 150A', 230.00, '/uploads/audi_a5_alternator.jpg', 1, 10, 1, 'Alternator', 2010, 2016, '2025-08-22 11:40:43', 3, 'diesel'),
(199, 'Air filter sport', 30.00, '/uploads/audi_a5_airfilter.jpg', 1, 10, 7, 'Air filter', 2010, 2016, '2025-08-22 11:40:43', 16, 'gas'),
(200, 'Flywheel dual mass', 345.00, '/uploads/audi_a5_flywheel.jpg', 1, 10, 4, 'Flywheel', 2010, 2016, '2025-08-22 11:40:43', 12, 'diesel'),
(201, 'Lambda O2 sensor', 90.00, '/uploads/audi_a5_lambda.jpg', 1, 10, 6, 'Lambda sensor', 2010, 2016, '2025-08-22 11:40:43', NULL, 'gas'),
(202, 'CV joint outer', 110.00, '/uploads/audi_a5_cvjoint.jpg', 1, 10, 8, 'CV joint', 2010, 2016, '2025-08-22 11:40:43', 20, 'gas'),
(203, 'Radiator with cooler', 240.00, '/uploads/audi_a6_radiator.jpg', 1, 11, NULL, 'Radiator', 2011, 2017, '2025-08-22 11:40:43', 21, 'diesel'),
(204, 'Flywheel DMF', 350.00, '/uploads/audi_a6_flywheel.jpg', 1, 11, 4, 'Flywheel', 2011, 2017, '2025-08-22 11:40:43', 12, 'diesel'),
(205, 'Front discs ventilated', 210.00, '/uploads/audi_a6_discs.jpg', 1, 11, 2, 'Front discs', 2011, 2017, '2025-08-22 11:40:43', 5, 'diesel'),
(206, 'Water pump complete', 180.00, '/uploads/audi_a6_waterpump.jpg', 1, 11, 1, 'Water pump', 2011, 2017, '2025-08-22 11:40:43', 2, 'diesel'),
(207, 'Cabin filter carbon', 25.00, '/uploads/audi_a6_cabinfilter.jpg', 1, 11, 7, 'Cabin filter', 2011, 2017, '2025-08-22 11:40:43', 17, 'gas'),
(208, 'Air filter sport', 28.00, '/uploads/audi_a7_airfilter.jpg', 1, 12, 7, 'Air filter', 2015, 2022, '2025-08-22 11:40:43', 16, 'gas'),
(209, 'Rear brake pads', 95.00, '/uploads/audi_a7_rearpads.jpg', 1, 12, 2, 'Rear pads', 2015, 2022, '2025-08-22 11:40:43', 6, 'diesel'),
(210, 'Thermostat with housing', 55.00, '/uploads/audi_a7_thermostat.jpg', 1, 12, NULL, 'Thermostat', 2015, 2022, '2025-08-22 11:40:43', 22, 'diesel'),
(211, 'NOx sensor OEM', 210.00, '/uploads/audi_a7_nox.jpg', 1, 12, 6, 'NOx sensor', 2015, 2022, '2025-08-22 11:40:43', NULL, 'diesel'),
(212, 'Floor mats velour', 95.00, '/uploads/audi_a7_mats.jpg', 1, 12, 10, 'Floor mats', 2015, 2022, '2025-08-22 11:40:43', 23, 'gas'),
(213, 'Spark plugs set of 4', 55.00, '/uploads/audi_q3_sparkplugs.jpg', 1, 13, 1, 'Spark plugs', 2014, 2020, '2025-08-22 11:40:43', 4, 'gas'),
(214, 'Front bumper primed', 300.00, '/uploads/audi_q3_bumper.jpg', 1, 13, 5, 'Front bumper', 2014, 2020, '2025-08-22 11:40:43', 13, 'gas'),
(215, 'Fuel filter diesel', 40.00, '/uploads/audi_q3_fuelfilter.jpg', 1, 13, 7, 'Fuel filter', 2014, 2020, '2025-08-22 11:40:43', 18, 'diesel'),
(216, 'Front shock absorber', 170.00, '/uploads/audi_q3_shock.jpg', 1, 13, 3, 'Front shock absorber', 2014, 2020, '2025-08-22 11:40:43', 8, 'gas'),
(217, 'ABS pump with ECU', 350.00, '/uploads/audi_q3_abspump.jpg', 1, 13, 6, 'ABS control unit', 2014, 2020, '2025-08-22 11:40:43', NULL, 'diesel'),
(218, 'Alternator 180A', 225.00, '/uploads/audi_q5_alternator.jpg', 1, 3, 1, 'Alternator', 2013, 2019, '2025-08-22 11:40:43', 3, 'diesel'),
(219, 'Drive shaft rear', 400.00, '/uploads/audi_q5_driveshaft.jpg', 1, 3, 8, 'Drive shaft', 2013, 2019, '2025-08-22 11:40:43', 19, 'diesel'),
(220, 'Radiator OEM', 210.00, '/uploads/audi_q5_radiator.jpg', 1, 3, NULL, 'Radiator', 2013, 2019, '2025-08-22 11:40:43', 21, 'gas'),
(221, 'Fuel filter common rail', 39.00, '/uploads/audi_q5_fuelfilter.jpg', 1, 3, 7, 'Fuel filter', 2013, 2019, '2025-08-22 11:40:43', 18, 'diesel'),
(222, 'Floor mats all-weather', 50.00, '/uploads/audi_q5_mats.jpg', 1, 3, 10, 'Floor mats', 2013, 2019, '2025-08-22 11:40:43', 23, 'gas'),
(223, 'Air filter panel', 34.00, '/uploads/audi_q7_airfilter.jpg', 1, 14, 7, 'Air filter', 2015, 2022, '2025-08-22 11:40:43', 16, 'diesel'),
(224, 'Front brake discs ventilated', 240.00, '/uploads/audi_q7_frontdiscs.jpg', 1, 14, 2, 'Front discs', 2015, 2022, '2025-08-22 11:40:43', 5, 'diesel'),
(225, 'Glow plug controller', 130.00, '/uploads/audi_q7_glowplug.jpg', 1, 14, 6, 'Glow plug controller', 2015, 2022, '2025-08-22 11:40:43', NULL, 'diesel'),
(226, 'Rear bumper primed', 360.00, '/uploads/audi_q7_rearbumper.jpg', 1, 14, 5, 'Rear bumper', 2015, 2022, '2025-08-22 11:40:43', 14, 'gas'),
(227, 'Adaptive rear shock', 295.00, '/uploads/audi_q7_rearshock.jpg', 1, 14, 3, 'Rear shock', 2015, 2022, '2025-08-22 11:40:43', 9, 'diesel'),
(228, 'Air filter sport', 30.00, '/uploads/audi_tt_airfilter.jpg', 1, 15, 7, 'Air filter', 2010, 2016, '2025-08-22 11:40:43', 16, 'gas'),
(229, 'Timing belt kit', 220.00, '/uploads/audi_tt_timingbelt.jpg', 1, 15, 1, 'Timing belt kit', 2010, 2016, '2025-08-22 11:40:43', 1, 'diesel'),
(230, 'Thermostat OEM', 45.00, '/uploads/audi_tt_thermostat.jpg', 1, 15, NULL, 'Thermostat', 2010, 2016, '2025-08-22 11:40:43', 22, 'gas'),
(231, 'Front drive shaft', 280.00, '/uploads/audi_tt_driveshaft.jpg', 1, 15, 8, 'Front drive shaft', 2010, 2016, '2025-08-22 11:40:43', 19, 'diesel'),
(232, 'Front bumper sport', 325.00, '/uploads/audi_tt_bumper.jpg', 1, 15, 5, 'Front bumper', 2010, 2016, '2025-08-22 11:40:43', 13, 'gas'),
(233, 'Rear brake discs Ø249mm', 89.00, '/uploads/peugeot_2008_reardiscs.jpg', 3, 28, 2, 'Rear brake discs', 2015, 2022, '2025-08-22 11:41:53', 5, 'diesel'),
(234, 'Hydraulic rear shock', 120.00, '/uploads/peugeot_2008_rearshock.jpg', 3, 28, 3, 'Rear shock absorber', 2015, 2022, '2025-08-22 11:41:53', 9, 'diesel'),
(235, 'Panel air filter', 20.00, '/uploads/peugeot_2008_airfilter.jpg', 3, 28, 7, 'Air filter', 2015, 2022, '2025-08-22 11:41:53', 16, 'gas'),
(236, 'CV joint outer kit', 95.00, '/uploads/peugeot_2008_cvjoint.jpg', 3, 28, 8, 'Outer CV joint', 2015, 2022, '2025-08-22 11:41:53', 20, 'diesel'),
(237, 'Complete clutch kit', 285.00, '/uploads/peugeot_2008_clutch.jpg', 3, 28, 4, 'Clutch kit', 2015, 2022, '2025-08-22 11:41:53', 11, 'diesel'),
(238, 'Front brake discs Ø266mm', 102.00, '/uploads/peugeot_208_frontdiscs.jpg', 3, 24, 2, 'Front brake discs', 2018, 2023, '2025-08-22 11:41:53', 5, 'gas'),
(239, 'Front shock absorber', 140.00, '/uploads/peugeot_208_shock.jpg', 3, 24, 3, 'Front shock absorber', 2018, 2023, '2025-08-22 11:41:53', 8, 'diesel'),
(240, 'Cabin filter carbon', 18.00, '/uploads/peugeot_208_cabinfilter.jpg', 3, 24, 7, 'Cabin filter', 2018, 2023, '2025-08-22 11:41:53', 17, 'gas'),
(241, 'Gear knob aluminum', 39.00, '/uploads/peugeot_208_gearknob.jpg', 3, 24, 10, 'Gear knob', 2018, 2023, '2025-08-22 11:41:53', 24, 'gas'),
(242, 'Spark plugs iridium', 55.00, '/uploads/peugeot_208_sparkplugs.jpg', 3, 24, 1, 'Spark plugs (set of 4)', 2018, 2023, '2025-08-22 11:41:53', 4, 'gas'),
(243, 'Fuel filter diesel', 34.00, '/uploads/peugeot_3008_fuelfilter.jpg', 3, 29, 7, 'Fuel filter', 2016, 2023, '2025-08-22 11:41:53', 18, 'diesel'),
(244, 'Rear brake pads ceramic', 75.00, '/uploads/peugeot_3008_rearpads.jpg', 3, 29, 2, 'Rear brake pads', 2016, 2023, '2025-08-22 11:41:53', 6, 'diesel'),
(245, 'Radiator OEM', 190.00, '/uploads/peugeot_3008_radiator.jpg', 3, 29, NULL, 'Radiator', 2016, 2023, '2025-08-22 11:41:53', 21, 'gas'),
(246, 'Alternator 180A', 210.00, '/uploads/peugeot_3008_alternator.jpg', 3, 29, 1, 'Alternator', 2016, 2023, '2025-08-22 11:41:53', 3, 'diesel'),
(247, 'Air filter panel', 25.00, '/uploads/peugeot_3008_airfilter.jpg', 3, 29, 7, 'Air filter', 2016, 2023, '2025-08-22 11:41:53', 16, 'gas'),
(248, 'Front discs ventilated', 95.00, '/uploads/peugeot_308_frontdiscs.jpg', 3, 25, 2, 'Front brake discs', 2014, 2020, '2025-08-22 11:41:53', 5, 'diesel'),
(249, 'Hydraulic rear shock', 128.00, '/uploads/peugeot_308_rearshock.jpg', 3, 25, 3, 'Rear shock absorber', 2014, 2020, '2025-08-22 11:41:53', 9, 'gas'),
(250, 'Complete clutch kit', 280.00, '/uploads/peugeot_308_clutch.jpg', 3, 25, 4, 'Clutch kit', 2014, 2020, '2025-08-22 11:41:53', 11, 'diesel'),
(251, 'Cabin filter carbon', 21.00, '/uploads/peugeot_308_cabinfilter.jpg', 3, 25, 7, 'Cabin filter', 2014, 2020, '2025-08-22 11:41:53', 17, 'gas'),
(252, 'Gear knob leather', 48.00, '/uploads/peugeot_308_gearknob.jpg', 3, 25, 10, 'Gear knob', 2014, 2020, '2025-08-22 11:41:53', 24, 'gas'),
(253, 'Front brake pads', 82.00, '/uploads/peugeot_408_frontpads.jpg', 3, 26, 2, 'Front brake pads', 2016, 2022, '2025-08-22 11:41:53', 6, 'diesel'),
(254, 'Water pump complete', 100.00, '/uploads/peugeot_408_waterpump.jpg', 3, 26, 1, 'Water pump', 2016, 2022, '2025-08-22 11:41:53', 2, 'diesel'),
(255, 'Fuel filter', 33.00, '/uploads/peugeot_408_fuelfilter.jpg', 3, 26, 7, 'Fuel filter', 2016, 2022, '2025-08-22 11:41:53', 18, 'diesel'),
(256, 'Radiator OEM', 185.00, '/uploads/peugeot_408_radiator.jpg', 3, 26, NULL, 'Radiator', 2016, 2022, '2025-08-22 11:41:53', 21, 'gas'),
(257, 'Rear shock absorber', 120.00, '/uploads/peugeot_408_rearshock.jpg', 3, 26, 3, 'Rear shock absorber', 2016, 2022, '2025-08-22 11:41:53', 9, 'gas'),
(258, 'Air filter OEM', 26.00, '/uploads/peugeot_508_airfilter.jpg', 3, 27, 7, 'Air filter', 2011, 2018, '2025-08-22 11:41:53', 16, 'gas'),
(259, 'Rear shock absorber', 130.00, '/uploads/peugeot_508_rearshock.jpg', 3, 27, 3, 'Rear shock absorber', 2011, 2018, '2025-08-22 11:41:53', 9, 'diesel'),
(260, 'Heavy duty clutch kit', 290.00, '/uploads/peugeot_508_clutch.jpg', 3, 27, 4, 'Clutch kit', 2011, 2018, '2025-08-22 11:41:53', 11, 'diesel'),
(261, 'Front bumper primed', 310.00, '/uploads/peugeot_508_bumper.jpg', 3, 27, 5, 'Front bumper', 2011, 2018, '2025-08-22 11:41:53', 13, 'gas'),
(262, 'Fuel filter diesel', 37.00, '/uploads/peugeot_508_fuelfilter.jpg', 3, 27, 7, 'Fuel filter', 2011, 2018, '2025-08-22 11:41:53', 18, 'diesel'),
(263, 'Front brake pads', 92.00, '/uploads/peugeot_5008_frontpads.jpg', 3, 30, 2, 'Front brake pads', 2017, 2023, '2025-08-22 11:41:53', 6, 'diesel'),
(264, 'Water pump complete', 110.00, '/uploads/peugeot_5008_waterpump.jpg', 3, 30, 1, 'Water pump', 2017, 2023, '2025-08-22 11:41:53', 2, 'diesel'),
(265, 'Fuel filter OEM', 39.00, '/uploads/peugeot_5008_fuelfilter.jpg', 3, 30, 7, 'Fuel filter', 2017, 2023, '2025-08-22 11:41:53', 18, 'diesel'),
(266, 'Rear shock absorber', 140.00, '/uploads/peugeot_5008_rearshock.jpg', 3, 30, 3, 'Rear shock absorber', 2017, 2023, '2025-08-22 11:41:53', 9, 'gas'),
(267, 'Alternator 180A', 225.00, '/uploads/peugeot_5008_alternator.jpg', 3, 30, 1, 'Alternator', 2017, 2023, '2025-08-22 11:41:53', 3, 'diesel'),
(268, NULL, 200.00, '/uploads/1755869860655-kocioni-disk-peugeot-5008-ii-2009-2020g-slika-132692171.jpg', 3, 30, 2, 'Front disc left', 2020, 2025, '2025-08-22 13:37:40', 5, NULL);



CREATE TABLE `part_subtypes` (
  `id` int(11) NOT NULL,
  `part_type_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `part_subtypes` (`id`, `part_type_id`, `name`) VALUES
(3, 1, 'alternator'),
(4, 1, 'spark plugs'),
(1, 1, 'timing belt'),
(2, 1, 'water pump'),
(5, 2, 'brake discs'),
(6, 2, 'brake pads'),
(7, 2, 'calipers'),
(8, 3, 'front shock absorber'),
(9, 3, 'rear shock absorber'),
(10, 3, 'springs'),
(11, 4, 'clutch kit'),
(12, 4, 'flywheel'),
(13, 5, 'front bumper'),
(14, 5, 'rear bumper'),
(16, 7, 'air filter'),
(17, 7, 'cabin filter'),
(18, 7, 'fuel filter'),
(15, 7, 'oil filter'),
(20, 8, 'CV joint'),
(19, 8, 'drive shaft'),
(21, 9, 'radiator'),
(22, 9, 'thermostat'),
(23, 10, 'floor mats'),
(24, 10, 'gear knob');



CREATE TABLE `part_types` (
  `id` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `part_types` (`id`, `NAME`) VALUES
(5, 'body'),
(2, 'brakes'),
(8, 'drivetrain'),
(6, 'electronics'),
(1, 'engine'),
(7, 'filters'),
(10, 'interior'),
(3, 'suspension'),
(4, 'transmission'),
(9, 'ventilation');



CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `users` (`id`, `email`, `password`, `is_admin`) VALUES
(1, 'admin@shop.com', '$2b$10$u7pQpoE8q1FyfA0HkzT8ZO8y/SnckPHNlqbD/H3vJLClyipN1OCxu', 1),
(2, 'david', '$2b$10$5j7ZfzZUlvYJ2ndqQxf34eSP/UmVKV4BqKH81l52G2XLsgLvMeAm.', 1),
(3, 'david@gmail.com', '$2b$10$BE1EwzqyQx2vTX0Rmi2E/us/I/XkNC17p4nZeNWK4s/XNg9T9pIYa', 1),
(4, 'david2@gmail.com', '$2b$10$BG7xMhweOy8Ubr5rntzRJ.jgOUvDbJSvhAPnssGURr8xzupKt5Y5i', 0),
(5, 'david3@gmail.com', '$2b$10$6vJ7Ni65YmAncRThZqlE8Om0k5qVUAh1951G/NVUZxrPZaEtKGPfO', 0),
(6, 'david333@gmail.com', '$2b$10$8t4jS9E/mVN79Le1qo5WX.SLxJjFhjnKsuMoFIsLebU7ebm0ASXNe', 0);

-- --------------------------------------------------------



CREATE TABLE `user_profiles` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `address_line1` varchar(120) NOT NULL,
  `house_no` varchar(20) NOT NULL,
  `address_line2` varchar(120) DEFAULT NULL,
  `city` varchar(80) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(80) NOT NULL DEFAULT 'Hrvatska',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `user_profiles` (`user_id`, `full_name`, `phone`, `address_line1`, `house_no`, `address_line2`, `city`, `postal_code`, `country`, `created_at`, `updated_at`) VALUES
(3, 'David Mihajlovic', '993240774', 'Osjecka', '60', 'd', 'Osijek', '31000', 'Hrvatska', '2025-08-20 15:47:55', '2025-08-20 15:47:55');


ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NAME` (`NAME`);


ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cart_user_part` (`user_id`,`part_id`);


ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_models_brand` (`brand_id`,`NAME`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `part_id` (`part_id`);


ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_parts_filters` (`brand_id`,`model_id`,`part_type_id`,`year_from`,`year_to`),
  ADD KEY `ix_parts_subtype` (`part_subtype_id`);


ALTER TABLE `part_subtypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_subtype` (`part_type_id`,`name`);


ALTER TABLE `part_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NAME` (`NAME`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`);


ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;



ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;


ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

ALTER TABLE `part_subtypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;


ALTER TABLE `part_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;


ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE `models`
  ADD CONSTRAINT `fk_models_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE;


ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);


ALTER TABLE `parts`
  ADD CONSTRAINT `fk_parts_subtype` FOREIGN KEY (`part_subtype_id`) REFERENCES `part_subtypes` (`id`) ON DELETE SET NULL;

ALTER TABLE `part_subtypes`
  ADD CONSTRAINT `fk_subtype_type` FOREIGN KEY (`part_type_id`) REFERENCES `part_types` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_profiles`
  ADD CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

