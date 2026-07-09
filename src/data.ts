import { Module } from './types';

export const scheduleData: Module[] = [
  {
    id: 'm1',
    name: 'Pump module No.1',
    tasks: [
      { id: 'm1-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-06-07', type: 'purchase' },
      { id: 'm1-t2', name: 'Steel cutting, preparation', startDate: '2026-06-07', endDate: '2026-06-28', type: 'cutting' },
      { id: 'm1-t3', name: 'Assembly', startDate: '2026-06-15', endDate: '2026-07-12', type: 'assembly' },
      { id: 'm1-t4', name: 'Welding', startDate: '2026-06-29', endDate: '2026-07-19', type: 'welding' },
      { id: 'm1-t5', name: 'Painting', startDate: '2026-07-20', endDate: '2026-08-16', type: 'painting' },
      { id: 'm1-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-08-17', endDate: '2026-08-20', type: 'shipment' },
      { id: 'm1-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm2',
    name: 'Pump module No.2',
    tasks: [
      { id: 'm2-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-06-07', type: 'purchase' },
      { id: 'm2-t2', name: 'Steel cutting, preparation', startDate: '2026-06-15', endDate: '2026-07-12', type: 'cutting' },
      { id: 'm2-t3', name: 'Assembly', startDate: '2026-06-29', endDate: '2026-07-26', type: 'assembly' },
      { id: 'm2-t4', name: 'Welding', startDate: '2026-07-13', endDate: '2026-08-02', type: 'welding' },
      { id: 'm2-t5', name: 'Painting', startDate: '2026-08-03', endDate: '2026-08-30', type: 'painting' },
      { id: 'm2-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-08-31', endDate: '2026-09-03', type: 'shipment' },
      { id: 'm2-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm3',
    name: 'Pump module No.3',
    tasks: [
      { id: 'm3-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-06-07', type: 'purchase' },
      { id: 'm3-t2', name: 'Steel cutting, preparation', startDate: '2026-06-29', endDate: '2026-07-26', type: 'cutting' },
      { id: 'm3-t3', name: 'Assembly', startDate: '2026-07-13', endDate: '2026-08-09', type: 'assembly' },
      { id: 'm3-t4', name: 'Welding', startDate: '2026-07-27', endDate: '2026-08-16', type: 'welding' },
      { id: 'm3-t5', name: 'Painting', startDate: '2026-08-17', endDate: '2026-09-14', type: 'painting' },
      { id: 'm3-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-09-15', endDate: '2026-09-18', type: 'shipment' },
      { id: 'm3-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm4',
    name: 'Corner Bracket No.1, 2 (2pcs)',
    tasks: [
      { id: 'm4-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-05-31', type: 'purchase' },
      { id: 'm4-t2', name: 'Steel cutting, preparation', startDate: '2026-05-31', endDate: '2026-06-28', type: 'cutting' },
      { id: 'm4-t3', name: 'Assembly', startDate: '2026-06-15', endDate: '2026-07-05', type: 'assembly' },
      { id: 'm4-t4', name: 'Welding', startDate: '2026-06-22', endDate: '2026-07-12', type: 'welding' },
      { id: 'm4-t5', name: 'Painting', startDate: '2026-07-13', endDate: '2026-07-23', type: 'painting' },
      { id: 'm4-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-07-24', endDate: '2026-07-27', type: 'shipment' },
      { id: 'm4-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm5',
    name: 'Corner Bracket No.3, 4, 5 (3pcs)',
    tasks: [
      { id: 'm5-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-05-31', type: 'purchase' },
      { id: 'm5-t2', name: 'Steel cutting, preparation', startDate: '2026-06-08', endDate: '2026-07-05', type: 'cutting' },
      { id: 'm5-t3', name: 'Assembly', startDate: '2026-06-15', endDate: '2026-07-12', type: 'assembly' },
      { id: 'm5-t4', name: 'Welding', startDate: '2026-06-29', endDate: '2026-07-19', type: 'welding' },
      { id: 'm5-t5', name: 'Painting', startDate: '2026-07-20', endDate: '2026-07-31', type: 'painting' },
      { id: 'm5-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-08-01', endDate: '2026-08-04', type: 'shipment' },
      { id: 'm5-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm6',
    name: 'Corner Bracket No.6, 7, 8 (3pcs)',
    tasks: [
      { id: 'm6-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-05-31', type: 'purchase' },
      { id: 'm6-t2', name: 'Steel cutting, preparation', startDate: '2026-06-15', endDate: '2026-07-12', type: 'cutting' },
      { id: 'm6-t3', name: 'Assembly', startDate: '2026-07-12', endDate: '2026-07-26', type: 'assembly' },
      { id: 'm6-t4', name: 'Welding', startDate: '2026-07-20', endDate: '2026-08-02', type: 'welding' },
      { id: 'm6-t5', name: 'Painting', startDate: '2026-08-03', endDate: '2026-08-16', type: 'painting' },
      { id: 'm6-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-08-17', endDate: '2026-08-20', type: 'shipment' },
      { id: 'm6-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  },
  {
    id: 'm7',
    name: 'Corner Bracket No.9, 10 (2pcs)',
    tasks: [
      { id: 'm7-t1', name: 'Steel purchase', startDate: '2026-05-18', endDate: '2026-05-31', type: 'purchase' },
      { id: 'm7-t2', name: 'Steel cutting, preparation', startDate: '2026-06-22', endDate: '2026-07-19', type: 'cutting' },
      { id: 'm7-t3', name: 'Assembly', startDate: '2026-07-20', endDate: '2026-08-02', type: 'assembly' },
      { id: 'm7-t4', name: 'Welding', startDate: '2026-08-03', endDate: '2026-08-16', type: 'welding' },
      { id: 'm7-t5', name: 'Painting', startDate: '2026-08-17', endDate: '2026-09-01', type: 'painting' },
      { id: 'm7-t6', name: 'S - Shipment / D - Delivery on-site', startDate: '2026-09-02', endDate: '2026-09-05', type: 'shipment' },
      { id: 'm7-t7', name: 'Outfitting', startDate: '', endDate: '', type: 'outfitting' }
    ]
  }
];
