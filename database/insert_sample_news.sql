-- ============================================
-- INSERT SAMPLE NEWS ARTICLES
-- Run this in phpMyAdmin SQL tab or MySQL command line
-- ============================================

USE ucaep_db;

-- Get admin user ID (assuming it exists)
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@ucaep.com' LIMIT 1);

-- If admin doesn't exist, create one first (or use existing user ID)
-- If @admin_id is NULL, set it to 1 (adjust if needed)
SET @admin_id = IFNULL(@admin_id, 1);

-- Insert Sample News Articles
INSERT INTO news (title, content, excerpt, category, status, published_at, author_id, image_url) VALUES

-- Article 1: Agriculture News
(
  'Les Comores lancent une nouvelle initiative d''agriculture durable',
  'Le ministère de l''Agriculture et l''UCAEP ont introduit un nouveau programme visant à promouvoir l''agriculture biologique et réduire l''utilisation de pesticides chimiques. Ce programme inclut des formations gratuites pour les producteurs, des subventions pour l''achat d''équipements écologiques, et un accompagnement technique personnalisé. L''objectif est d''améliorer la santé des sols à travers les îles tout en augmentant la productivité des cultures. Plus de 500 producteurs sont attendus à participer à la première phase du programme qui débutera le mois prochain.',
  'Le ministère de l''Agriculture a introduit un nouveau programme visant à promouvoir l''agriculture biologique, réduire l''utilisation de pesticides chimiques et améliorer la santé des sols à travers les îles.',
  'news',
  'published',
  NOW() - INTERVAL 5 DAY,
  @admin_id,
  NULL
),

-- Article 2: Fisheries News
(
  'De nouveaux bateaux de pêche livrés aux communautés locales',
  'Afin de renforcer la capacité de pêche locale, le Département des Pêches a distribué 20 bateaux écologiques équipés de moteurs alimentés à l''énergie solaire. Ces bateaux modernes permettront aux pêcheurs de réduire leurs coûts opérationnels tout en respectant l''environnement. Chaque bateau est accompagné d''une formation sur les techniques de pêche durable et la maintenance des équipements. Cette initiative fait partie du programme national de développement de la pêche artisanale et devrait bénéficier à plus de 200 pêcheurs dans les trois îles.',
  'Afin de renforcer la capacité de pêche locale, le Département des Pêches a distribué 20 bateaux écologiques équipés de moteurs alimentés à l''énergie solaire.',
  'news',
  'published',
  NOW() - INTERVAL 10 DAY,
  @admin_id,
  NULL
),

-- Article 3: Livestock News
(
  'Campagne de vaccination – Semaine de la santé du bétail 2025',
  'Plus de 5 000 animaux ont été vaccinés dans le cadre de la campagne de la Semaine de la santé du bétail, visant à prévenir les maladies contagieuses dans les zones rurales. Cette campagne annuelle, organisée par l''UCAEP en collaboration avec le ministère de l''Élevage, couvre toutes les îles et bénéficie aux éleveurs de bovins, caprins, ovins et volailles. Des équipes vétérinaires mobiles se sont déplacées dans les zones les plus reculées pour assurer une couverture complète. La prochaine campagne est prévue pour le semestre prochain.',
  'Plus de 5 000 animaux ont été vaccinés dans le cadre de la campagne de la Semaine de la santé du bétail, visant à prévenir les maladies contagieuses dans les zones rurales.',
  'news',
  'published',
  NOW() - INTERVAL 15 DAY,
  @admin_id,
  NULL
),

-- Article 4: Press Release
(
  'L''UCAEP s''associe à la FAO pour le développement agricole',
  'L''Union des Chambres d''Agriculture, d''Élevage et de Pêche (UCAEP) a signé un accord de partenariat stratégique avec l''Organisation des Nations Unies pour l''Alimentation et l''Agriculture (FAO). Cet accord permettra de renforcer les capacités des producteurs agricoles et d''améliorer la sécurité alimentaire aux Comores. Les projets incluront des formations techniques, du financement pour les équipements, et un partage d''expertise international. Ce partenariat marque une étape importante dans le développement durable du secteur agricole comorien.',
  'L''Union des Chambres d''Agriculture, d''Élevage et de Pêche (UCAEP) a signé un accord avec la FAO pour soutenir le développement rural durable aux Comores.',
  'press_release',
  'published',
  NOW() - INTERVAL 20 DAY,
  @admin_id,
  NULL
),

-- Article 5: Event
(
  'Forum national sur l''agriculture et la pêche 2025',
  'Rejoignez les acteurs nationaux et les partenaires internationaux pour discuter de l''innovation, de la durabilité et de l''investissement dans les secteurs de l''agriculture et de la pêche. Le forum se tiendra du 18 au 20 novembre 2025 à Moroni et réunira plus de 500 participants, incluant des producteurs, des experts, des investisseurs et des représentants gouvernementaux. Les thèmes principaux incluront l''agriculture intelligente face au climat, les technologies modernes de pêche, et les opportunités de financement. L''inscription est gratuite et ouverte à tous.',
  'Rejoignez les acteurs nationaux et les partenaires internationaux pour discuter de l''innovation, de la durabilité et de l''investissement dans les secteurs de l''agriculture et de la pêche.',
  'event',
  'published',
  NOW() - INTERVAL 2 DAY,
  @admin_id,
  NULL
),

-- Article 6: Announcement
(
  'Appel à candidatures: Programme de Financement Agricole 2025',
  'L''UCAEP lance un appel à candidatures pour son programme de financement annuel destiné aux producteurs agricoles, éleveurs et pêcheurs. Ce programme offre des subventions allant jusqu''à 5 millions de francs comoriens et des prêts à taux préférentiel pour le développement de projets durables. Les domaines éligibles incluent l''achat d''équipements modernes, l''amélioration des infrastructures, la formation et le développement de nouvelles techniques. Les candidatures sont ouvertes jusqu''au 31 décembre 2025. Tous les producteurs éligibles sont encouragés à postuler via le site web ou les bureaux locaux de l''UCAEP.',
  'Programme de financement 2025: Subventions et prêts pour les producteurs agricoles, éleveurs et pêcheurs',
  'announcement',
  'published',
  NOW() - INTERVAL 1 DAY,
  @admin_id,
  NULL
),

-- Article 7: News
(
  'Nouvelle formation en techniques d''irrigation modernes',
  'Une nouvelle formation sur les techniques d''irrigation modernes et économes en eau sera organisée prochainement par l''UCAEP. Cette formation de 5 jours s''adresse aux producteurs agricoles souhaitant améliorer leur gestion de l''eau et réduire leurs coûts. Les participants apprendront à installer et entretenir des systèmes d''irrigation goutte à goutte, à mesurer l''humidité du sol, et à optimiser l''utilisation de l''eau selon les types de cultures. Des certificats de participation seront délivrés à la fin du programme. L''inscription est gratuite mais les places sont limitées.',
  'Formation gratuite sur les techniques d''irrigation modernes pour améliorer la gestion de l''eau dans l''agriculture',
  'news',
  'published',
  NOW() - INTERVAL 3 DAY,
  @admin_id,
  NULL
),

-- Article 8: Press Release
(
  'Signature d''un accord de coopération avec l''Union Européenne',
  'L''UCAEP a signé un accord de coopération avec l''Union Européenne pour le financement de programmes de développement agricole et rural aux Comores. Cet accord, d''un montant de 10 millions d''euros, permettra de financer des projets d''infrastructure agricole, de formation technique, et d''accès aux marchés. La première phase du programme débutera au début de l''année prochaine et devrait bénéficier à plus de 2 000 producteurs dans les trois îles. Ce partenariat renforce la collaboration entre l''UCAEP et ses partenaires internationaux pour le développement durable du secteur agricole.',
  'Accord de coopération de 10 millions d''euros avec l''Union Européenne pour le développement agricole et rural',
  'press_release',
  'published',
  NOW() - INTERVAL 7 DAY,
  @admin_id,
  NULL
);

-- Verify the insertions
SELECT 
  id,
  title,
  category,
  status,
  DATE(published_at) as published_date
FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC;

-- Count articles
SELECT 
  category,
  COUNT(*) as count
FROM news
WHERE status = 'published'
GROUP BY category;

