import Certification from '../../models/portfolio/Certification.js';
import { generateSignedUrl } from '../vault/uploadController.js';

export const getCertifications = async (req, res) => {
  try {
    let certifications = await Certification.find({ user: req.user._id }).sort({ id: 1 });
    certifications = await Promise.all(certifications.map(async (cert) => {
      cert = cert.toObject();
      if (cert.image?.startsWith('portfolio/')) {
        try {
          cert.imageUrl = await generateSignedUrl(cert.image, 3600);
        } catch (err) {
          console.warn('Could not generate signed URL for certification image:', err.message);
        }
      }
      return cert;
    }));
    res.json(certifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCertification = async (req, res) => {
  try {
    res.status(201).json(await new Certification({ user: req.user._id, ...req.body }).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};