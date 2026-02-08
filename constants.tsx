
import { Plant, ValidationStatus, Practitioner, AccessType } from './types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    commonName: 'Artemisia Annua',
    scientificName: 'Artemisia annua',
    localNames: ['Armoise annuelle', 'Sweet wormwood'],
    uses: ['Paludisme', 'Fièvre', 'Infections parasitaires'],
    preparation: 'Infusion de feuilles séchées (5g/L) infusées pendant 15 minutes à 80°C.',
    precautions: 'À utiliser sous supervision médicale. Ne pas dépasser 7 jours de cure continue.',
    status: ValidationStatus.VALIDATED,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    region: 'Toute l\'Afrique',
    accessType: AccessType.FREE,
    recipes: [
      {
        id: 'r1',
        title: 'Décoction Préventive de Saison',
        description: 'Utilisée pour renforcer le système immunitaire avant les pics de transmission.',
        ingredients: ['10g Artemisia séchée', '1L Eau de source'],
        steps: ['Bouillir l\'eau', 'Infuser 15 min', 'Filtrer et consommer tiède'],
        authorId: 'p1',
        authorName: 'Papa Samuel',
        date: '12/05/2025',
        // Fix: Add missing properties from Recipe interface
        status: 'APPROVED',
        plantId: '1'
      }
    ]
  },
  {
    id: '2',
    commonName: 'Kinkeliba',
    scientificName: 'Combretum micranthum',
    localNames: ['Tisane de longue vie', 'Sékhew'],
    uses: ['Détoxification', 'Paludisme', 'Digestion', 'Hypertension'],
    preparation: 'Décoction de 20g de feuilles par litre d\'eau, bouillir 10 minutes.',
    precautions: 'Aucune connue en usage modéré. Éviter en cas d\'obstruction des voies biliaires.',
    status: ValidationStatus.VALIDATED,
    imageUrl: '/kinkeliba.jpg',
    region: 'Afrique de l\'Ouest',
    accessType: AccessType.PREMIUM,
    price: 2500,
    recipes: []
  },
  {
    id: '3',
    commonName: 'Moringa',
    scientificName: 'Moringa oleifera',
    localNames: ['Nébéday', 'Arbre de vie'],
    uses: ['Anémie', 'Diabète', 'Malnutrition', 'Énergie'],
    preparation: 'Poudre de feuilles séches dans les aliments ou infusion légère.',
    precautions: 'Les racines et l\'écorce peuvent être abortives. Consommer uniquement les feuilles en cas de grossesse.',
    status: ValidationStatus.VALIDATED,
    imageUrl: '/moringa.jpg',
    region: 'Zones tropicales',
    accessType: AccessType.FREE,
    recipes: []
  }
];

export const PRACTITIONERS: Practitioner[] = [
  {
    id: 'p1',
    name: 'Papa Samuel',
    specialty: 'Maître Herboriste Traditionnel',
    location: 'Douala, Bonabéri',
    certified: true,
    phone: '+237 670 123 456',
    lat: 4.0511,
    lng: 9.7679
  },
  {
    id: 'p2',
    name: 'Dr. Amina Touré',
    specialty: 'Pharmacienne Ethnobiologiste',
    location: 'Yaoundé, Bastos',
    certified: true,
    phone: '+237 699 887 766',
    lat: 3.8480,
    lng: 11.5021
  }
];
